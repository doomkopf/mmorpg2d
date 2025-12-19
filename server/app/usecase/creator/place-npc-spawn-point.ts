import { EntityFunc, FuncVisibility, StatelessFunc } from "../../../tmp-api/core"
import { mapNpcSpawnPointsToDto } from "../../area-mapping"
import { Vector2D } from "../../engine-shared/geom/Vector2D"
import { Area } from "../../entity/area/Area"
import { areaUseCaseValidations } from "../../entity/area/area-tools"
import { NpcSpawnPoint } from "../../entity/area/NpcSpawnPoint"
import { ENTITY_TEMPLATES } from "../../game-data/entity-templates"
import { PlaceNpcSpawnPointRequest, UpdateNpcSpawnPointsDto, UseCaseId } from "../../game-shared/dto"
import { userToArea } from "../tools/user-to-area"

export const placeNpcSpawnPoint: StatelessFunc<PlaceNpcSpawnPointRequest> = {
    vis: FuncVisibility.pub,
    func: (lib, params, ctx) => {
        userToArea(lib.entityFunc, ctx, "placeNpcSpawnPoint1", params)
    },
}

export const placeNpcSpawnPoint1: EntityFunc<Area, PlaceNpcSpawnPointRequest> = {
    vis: FuncVisibility.pri,
    func: (area, id, lib, params, ctx) => {
        if (!ctx.requestingUserId) {
            return undefined
        }

        area.update(lib, id)

        if (!areaUseCaseValidations(area, ctx.requestingUserId)) {
            return undefined
        }

        area.npcSpawnPoints.addNpcSpawnPoint(new NpcSpawnPoint(
                params.templateId,
                ENTITY_TEMPLATES.templates[params.templateId].template,
                new Vector2D(params.pos.x, params.pos.y),
                null,
                0,
            ),
            lib.tools)

        const dto: UpdateNpcSpawnPointsDto = {
            uc: UseCaseId.UPDATE_NPC_SPAWN_POINTS,
            npcSpawnPoints: mapNpcSpawnPointsToDto(area.npcSpawnPoints),
        }
        area.sendToAllExcept(lib.user, dto, null)

        return area
    },
}
