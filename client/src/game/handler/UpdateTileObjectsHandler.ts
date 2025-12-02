import { EngineAppContext } from "../../engine/Engine"
import { mapDtoToTileObject } from "../area-mapping"
import { GameContext } from "../GameContext"
import { Json } from "../server/arcturus-client/arcturus-client"
import { MessageHandler } from "../server/arcturus-client/arcturus-session"
import { UpdateTileObjectsDto } from "../shared/dto"

export class UpdateTileObjectsHandler implements MessageHandler {
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

        const updateTileObjectsDto = json as UpdateTileObjectsDto
        area.replaceTileObjects(updateTileObjectsDto.objects.map(line => line.map(mapDtoToTileObject)))
    }
}
