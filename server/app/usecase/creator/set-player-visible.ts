import { EntityFunc, FuncVisibility, StatelessFunc } from "../../../tmp-api/core"
import { Area } from "../../entity/area/Area"
import { areaUseCaseValidations } from "../../entity/area/area-tools"
import { SetPlayerVisibleRequest, SetPlayerVisibleResponse, STATUS_KEY, StatusKey } from "../../game-shared/dto"
import { sendResponseWithClientRequestId } from "../../tools"
import { userToArea } from "../tools/user-to-area"

export const setPlayerVisible: StatelessFunc<SetPlayerVisibleRequest> = {
    vis: FuncVisibility.pub,
    func: (lib, params, ctx) => {
        userToArea(lib.entityFunc, ctx, "setPlayerVisible1", params)
    },
}

export const setPlayerVisible1: EntityFunc<Area, SetPlayerVisibleRequest> = {
    vis: FuncVisibility.pri,
    func: (area, id, lib, params, ctx) => {
        if (!ctx.requestingUserId) {
            return undefined
        }

        area.update(lib, id)

        if (!areaUseCaseValidations(area, ctx.requestingUserId)) {
            return undefined
        }

        const attackable = area.entities.attackables.get(ctx.requestingUserId)
        attackable.isVisible = params.visible

        const response: SetPlayerVisibleResponse = {
            [STATUS_KEY]: StatusKey.OK,
            visible: attackable.isVisible,
        }
        sendResponseWithClientRequestId(ctx, response)

        return area
    },
}
