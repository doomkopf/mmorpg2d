import { GameContext } from "../GameContext"
import { Json } from "../server/arcturus-client/arcturus-client"
import { MessageHandler } from "../server/arcturus-client/arcturus-session"
import { DespawnEntityDto } from "../shared/dto"

export class DespawnEntityHandler implements MessageHandler {
  constructor(
    private readonly gameCtx: GameContext,
  ) {
  }

  handle(json: Json): void {
    const { area } = this.gameCtx
    if (!area) {
      console.error("No area")
      return
    }

    const despawnEntityDto = json as DespawnEntityDto

    area.removeEntity(despawnEntityDto.id)
  }
}
