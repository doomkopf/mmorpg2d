import { EngineAppContext } from "../../engine/Engine"
import { GameContext } from "../GameContext"
import { Json } from "../server/arcturus-client/arcturus-client"
import { MessageHandler } from "../server/arcturus-client/arcturus-session"
import { UpdateAirDto } from "../shared/dto"

export class UpdateAirHandler implements MessageHandler {
  constructor(
    private readonly ctx: EngineAppContext,
    private readonly gameCtx: GameContext,
  ) {
  }

  handle(json: Json): void {
    const { area } = this.ctx
    if (!area) {
      console.error("No area")
      return
    }

    const updateAirDto = json as UpdateAirDto
    area.replaceAir(updateAirDto.air)
  }
}
