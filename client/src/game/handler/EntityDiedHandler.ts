import { GameContext } from "../GameContext"
import { Json } from "../server/arcturus-client/arcturus-client"
import { MessageHandler } from "../server/arcturus-client/arcturus-session"
import { EntityDiedDto } from "../shared/dto"

export class EntityDiedHandler implements MessageHandler {
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

    const entityDiedDto = json as EntityDiedDto

    area.entities.humanoidAnimations.get(entityDiedDto.id).dead()
    area.engineArea.entities.movables.get(entityDiedDto.id).stop()
  }
}
