import { createEntityFromDto } from "../entity-mapping"
import { GameContext } from "../GameContext"
import { Json } from "../server/arcturus-client/arcturus-client"
import { MessageHandler } from "../server/arcturus-client/arcturus-session"
import { SpawnEntityDto } from "../shared/dto"

export class SpawnEntityHandler implements MessageHandler {
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

        const spawnEntityDto = json as SpawnEntityDto

        createEntityFromDto(area.engineArea.entities, area.entities, spawnEntityDto.entity)
    }
}
