import { updateEntityFromDto } from "../entity-mapping"
import { GameContext } from "../GameContext"
import { Json } from "../server/arcturus-client/arcturus-client"
import { MessageHandler } from "../server/arcturus-client/arcturus-session"
import { UpdateEntitiesDto } from "../shared/dto"

export class UpdateEntitiesHandler implements MessageHandler {
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

        const updateEntitiesDto = json as UpdateEntitiesDto

        for (const dto of updateEntitiesDto.entities) {
            updateEntityFromDto(area.engineArea.entities, area.entities, dto)
        }
    }
}
