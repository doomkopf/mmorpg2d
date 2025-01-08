import { GameContext } from "../GameContext"
import { Json } from "../server/arcturus-client/arcturus-client"
import { MessageHandler } from "../server/arcturus-client/arcturus-session"
import { EntityAttackedDto } from "../shared/dto"

export class EntityAttackedHandler implements MessageHandler {
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

    const entityAttackedDto = json as EntityAttackedDto

    area.entities.humanoidAnimations.get(entityAttackedDto.id).attack(Date.now())
  }
}
