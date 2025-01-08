import { GameContext } from "../GameContext"
import { Json } from "../server/arcturus-client/arcturus-client"
import { MessageHandler } from "../server/arcturus-client/arcturus-session"
import { UpdateNpcSpawnPointsDto } from "../shared/dto"

export class UpdateNpcSpawnPointsHandler implements MessageHandler {
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

    const updateNpcSpawnPointsDto = json as UpdateNpcSpawnPointsDto
    area.replaceNpcSpawnPoints(updateNpcSpawnPointsDto.npcSpawnPoints)
  }
}
