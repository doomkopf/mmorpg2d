import { EntityFunc, FuncVisibility, StatelessFunc } from "../../tmp-api/core"
import { Vector2D } from "../engine-shared/geom/Vector2D"
import { Area } from "../entity/area/Area"
import { areaUseCaseValidations } from "../entity/area/area-tools"
import { MovePlayerRequest } from "../game-shared/dto"
import { applyClientPosIfAcceptable } from "../tools"
import { userToArea } from "./tools/user-to-area"

export const movePlayer: StatelessFunc<MovePlayerRequest> = {
    vis: FuncVisibility.pub,
    func: (lib, params, ctx) => {
        userToArea(lib.entityFunc, ctx, "movePlayer1", params)
    },
}

export const movePlayer1: EntityFunc<Area, MovePlayerRequest> = {
    vis: FuncVisibility.pri,
    func: (area, id, lib, params, ctx) => {
        if (!ctx.requestingUserId) {
            return
        }

        area.update(lib, id)

        if (!areaUseCaseValidations(area, ctx.requestingUserId)) {
            return
        }

        const attackable = area.entities.attackables.get(ctx.requestingUserId)
        if (!attackable.isAlive) {
            return
        }

        const pos = area.entities.positionables.get(ctx.requestingUserId)
        const movable = area.entities.movables.get(ctx.requestingUserId)

        const useClientPos = applyClientPosIfAcceptable(pos, params.pos)

        movable.moveInDirection(
            new Vector2D(params.dir.x, params.dir.y),
            ctx.requestingUserId,
            area,
            lib.user,
            useClientPos ? ctx.requestingUserId : null,
        )
    },
}
