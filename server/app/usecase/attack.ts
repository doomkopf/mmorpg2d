import { EntityFunc, FuncVisibility, StatelessFunc } from "../../tmp-api/core"
import { Area } from "../entity/area/Area"
import { areaUseCaseValidations } from "../entity/area/area-tools"
import { userToArea } from "./tools/user-to-area"

export const attack: StatelessFunc<never> = {
    vis: FuncVisibility.pub,
    func: (lib, params, ctx) => {
        userToArea(lib.entityFunc, ctx, "attack1", null)
    },
}

export const attack1: EntityFunc<Area, never> = {
    vis: FuncVisibility.pri,
    func: (area: Area, id, lib, params, ctx) => {
        if (!ctx.requestingUserId) {
            return
        }

        if (!areaUseCaseValidations(area, ctx.requestingUserId)) {
            return
        }

        area.update(lib, id)

        area.entities.attackers.get(ctx.requestingUserId).attack(ctx.requestingUserId, area, lib.user, ctx.requestingUserId)
    },
}
