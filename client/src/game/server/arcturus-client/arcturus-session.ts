import { ArcturusClient, ArcturusClientListener, Json, WebsocketFactory } from "./arcturus-client"

const STATUS_SERVICE_NOT_AVAILABLE = "serviceNotAvailable"
const RESPONSE_KEY_REQUEST_ID = "gamrid"

export interface ArcturusSessionListener {
  onConnected(): void

  onDisconnected(): void

  onConnectionRefused(): void
}

export interface MessageHandler {
  handle(json: Json): void
}

export class ArcturusSession implements ArcturusClientListener {
  private readonly responseServiceNotAvailable

  private readonly client: ArcturusClient

  private messageHandlers = new Map<string, MessageHandler>()
  private readonly pendingCallbacks = new Map<string, (responseBody: Json) => void>()

  constructor(
    websocketFactory: WebsocketFactory,
    private readonly generateUuid: () => string,
    private readonly appId: string,
    host: string,
    port: number,
    private readonly funcIdResponseKey: string,
    statusKey: string,
    private readonly sessionListener: ArcturusSessionListener,
  ) {
    this.responseServiceNotAvailable = { [statusKey]: STATUS_SERVICE_NOT_AVAILABLE }

    this.client = new ArcturusClient(
      host,
      port,
      websocketFactory,
      this)
  }

  private sendDirect(
    func: string,
    entityType: string,
    entityId: string,
    requestId: string | null,
    json: Json,
  ) {
    this.client.send(
      func,
      this.appId,
      entityType,
      entityId,
      undefined, // no sessionId for now since for persistent sessions it is attached in server on login
      requestId,
      json)
  }

  onReceived(json: Json): void {
    if (json.status === "internalError") {
      console.error(`ArcApp error: service=${json.service}, uc=${json.uc}, msg=${json.msg}`)
    }

    const plainFuncId = json[this.funcIdResponseKey]
    if (plainFuncId) {
      const funcId = plainFuncId.toString() as string
      const messageHandler = this.messageHandlers.get(funcId)
      if (messageHandler) {
        messageHandler.handle(json)
        return
      }
      else {
        console.warn(`No responseHandler found for func with id: ${funcId}`)
      }
    }

    const requestId = json[RESPONSE_KEY_REQUEST_ID] as string
    if (requestId) {
      const callback = this.pendingCallbacks.get(requestId)
      if (!callback) {
        console.warn(`No pending callback found for requestId: ${requestId}`)
        return
      }

      this.pendingCallbacks.delete(requestId)

      callback(json)
      return
    }

    if (this.pendingCallbacks.size === 1) {
      const [callback] = this.pendingCallbacks.values()
      this.pendingCallbacks.clear()

      callback(json)
      return
    }

    console.warn(`Received unidentifiable response: ${JSON.stringify(json)}`)
  }

  private clearPendingCallbacks() {
    const callbacks = this.pendingCallbacks
    this.pendingCallbacks.clear()
    callbacks.forEach(callback => callback(this.responseServiceNotAvailable))
  }

  onConnectionRefused(): void {
    this.clearPendingCallbacks()
    this.sessionListener.onConnectionRefused()
  }

  onConnected(): void {
    this.sessionListener.onConnected()
  }

  onDisconnected(): void {
    this.clearPendingCallbacks()
    this.sessionListener.onDisconnected()
  }

  addMessageHandler(func: string, messageHandler: MessageHandler): void {
    this.messageHandlers.set(func, messageHandler)
  }

  request(func: string, entityType: string, entityId: string, requestBody: Json, callback: (responseBody: Json) => void): void {
    const requestId = this.generateUuid()
    this.pendingCallbacks.set(requestId, callback)
    this.sendDirect(func, entityType, entityId, requestId, requestBody)
  }

  async requestSync(func: string, entityType: string, entityId: string, requestBody: Json): Promise<Json> {
    return new Promise(resolve => {
      this.request(func, entityType, entityId, requestBody, responseBody => {
        resolve(responseBody)
      })
    })
  }

  send(func: string, entityType: string, entityId: string, requestBody: Json): void {
    this.sendDirect(func, entityType, entityId, null, requestBody)
  }

  isConnected(): boolean {
    return this.client.isConnected()
  }

  close(): void {
    this.client.close()
  }
}
