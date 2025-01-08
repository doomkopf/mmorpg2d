import { ArcturusWebsocket, ArcturusWebsocketListener } from "./arcturus-websocket"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = Record<string, any>

export interface ArcturusClientListener {
  onReceived(json: Json): void

  onConnected(): void

  onDisconnected(): void

  onConnectionRefused(): void
}

export type WebsocketFactory = (url: string, listener: ArcturusWebsocketListener) => Promise<ArcturusWebsocket>

export class ArcturusClient {
  private sendQueue: string[] = []
  private ws: ArcturusWebsocket | null = null
  private connecting = false

  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly websocketFactory: WebsocketFactory,
    private readonly clientListener: ArcturusClientListener,
  ) {
  }

  isConnected(): boolean {
    if (!this.ws) {
      return false
    }
    return this.ws.isOpen()
  }

  private isConnecting(): boolean {
    if (!this.ws) {
      return false
    }
    return this.connecting
  }

  private async connectIfNotConnected(): Promise<boolean> {
    if (this.isConnected()) {
      return true
    }

    if (this.isConnecting()) {
      return false
    }

    this.connecting = true

    return new Promise(resolve => {
      this.websocketFactory(`${this.port === 443 ? "wss" : "ws"}://${this.host}:${this.port}/arcwsapi`,
        {
          onOpen: () => {
            this.connecting = false
            resolve(true)
            this.clientListener.onConnected()
          },
          onClose: () => {
            this.connecting = false
            this.clientListener.onDisconnected()
          },
          onError: () => {
            this.connecting = false
            resolve(false)
            this.clientListener.onConnectionRefused()
          },
          onMessage: (data: string) => {
            this.clientListener.onReceived(JSON.parse(data))
          },
        })
        .then(ws => {
          this.ws = ws
        })
    })
  }

  private sendDirectAllFromQueue() {
    this.sendQueue.forEach(elem => this.sendDirect(elem))
    this.sendQueue = []
  }

  private sendDirect(payload: string) {
    this.ws?.send(payload)
  }

  async send(
    func: string,
    appId: string,
    entityType: string,
    entityId: string,
    sessionId: string,
    requestId: string | null,
    requestBody: Json,
  ): Promise<void> {
    this.sendQueue.push(`${func}&${appId}&${entityType}&${entityId}&${sessionId}&${requestId || ""}${JSON.stringify(requestBody)}`)

    if (!await this.connectIfNotConnected()) {
      return
    }

    this.sendDirectAllFromQueue()
  }

  close(): void {
    if (this.ws) {
      this.ws.close()
    }
  }
}
