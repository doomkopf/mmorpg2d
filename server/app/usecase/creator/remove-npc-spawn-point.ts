import { EntityFunc, FuncVisibility, StatelessFunc } from "../../../tmp-api/core"
import { mapNpcSpawnPointsToDto } from "../../area-mapping"
import { Area } from "../../entity/area/Area"
import { areaUseCaseValidations } from "../../entity/area/area-tools"
import { RemoveNpcSpawnPointRequest, UpdateNpcSpawnPointsDto, UseCaseId } from "../../game-shared/dto"
import { userToArea } from "../tools/user-to-area"

export const removeNpcSpawnPoint: StatelessFunc<RemoveNpcSpawnPointRequest> = {
    vis: FuncVisibility.pub,
    func: (lib, params, ctx) => {
        userToArea(lib.entityFunc, ctx, "removeNpcSpawnPoint1", params)
    },
}

export const removeNpcSpawnPoint1: EntityFunc<Area, RemoveNpcSpawnPointRequest> = {
    vis: FuncVisibility.pri,
    func: (area, id, lib, params, ctx) => {
        if (!ctx.requestingUserId) {
            return undefined
        }

        area.update(lib, id)

        if (!areaUseCaseValidations(area, ctx.requestingUserId)) {
            return undefined
        }

        area.npcSpawnPoints.removeNpcSpawnPoint(params.id)

        const dto: UpdateNpcSpawnPointsDto = {
            uc: UseCaseId.UPDATE_NPC_SPAWN_POINTS,
            npcSpawnPoints: mapNpcSpawnPointsToDto(area.npcSpawnPoints),
        }
        area.sendToAllExcept(lib.user, dto, null)

        return area
    },
}
