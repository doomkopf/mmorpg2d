import { STATUS_KEY, USE_CASE_ID, UseCaseId } from "../shared/dto"
import { generateUuid } from "../tools"
import { Json } from "./arcturus-client/arcturus-client"
import { ArcturusSession, ArcturusSessionListener, MessageHandler } from "./arcturus-client/arcturus-session"
import { createBrowserArcturusWebsocket } from "./arcturus-client/arcturus-websocket"

export class Server implements ArcturusSessionListener {
  private readonly session: ArcturusSession

  constructor() {
    this.session = new ArcturusSession(
      createBrowserArcturusWebsocket,
      generateUuid,
      "rpg",
      "localhost",
      8080,
      USE_CASE_ID,
      STATUS_KEY,
      this,
    )
  }

  addMessageHandler(ucId: number, messageHandler: MessageHandler): void {
    this.session.addMessageHandler(ucId.toString(), messageHandler)
  }

  request(usecase: UseCaseId, entityType: string, entityId: string, requestBody: Json): Promise<Json> {
    return this.session.requestSync(usecase.toString(), entityType, entityId, requestBody)
  }

  send(usecase: UseCaseId, entityType: string, entityId: string, requestBody: Json): void {
    this.session.send(usecase.toString(), entityType, entityId, requestBody)
  }

  onConnected(): void {
    console.log("Connected")
  }

  onDisconnected(): void {
    console.log("Disconnected")
  }

  onConnectionRefused(): void {
    console.error("Error connecting to server")
  }
}
