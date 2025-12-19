import { EntityFunc, EntityFunctions, EntityId, FuncVisibility } from "../../../tmp-api/core"
import { Area, JoinAreaSide } from "../../entity/area/Area"
import { createDefaultArea } from "../../entity/area/area-config"
import { User } from "../../entity/user/User"

/**
 * User needs to be removed from its current area first.
 */
export function startJoinArea(
    entityFuncs: EntityFunctions,
    userId: EntityId,
    areaId: string,
    side?: JoinAreaSide,
): void {
    const params: JoinAreaUser = {
        areaId,
        side,
    }
    entityFuncs.invoke("user", "joinArea1", userId, params)
}

interface JoinAreaUser {
    areaId: string;
    side?: JoinAreaSide;
}

export const joinArea1: EntityFunc<User, JoinAreaUser> = {
    vis: FuncVisibility.pri,
    func: (user, id, lib, params) => {
        if (!user) {
            user = new User(null)
        }

        user.areaId = params.areaId
        const joinArea: JoinArea = {
            userId: id,
            side: params.side,
        }
        lib.entityFunc.invoke("area", "joinArea2", user.areaId, joinArea)

        return user
    },
}

interface JoinArea {
    userId: string;
    side?: JoinAreaSide;
}

export const joinArea2: EntityFunc<Area, JoinArea> = {
    vis: FuncVisibility.pri,
    func: (area, id, lib, params) => {
        if (!area) {
            area = createDefaultArea()
        }

        area.update(lib, id)

        area.joinUser(lib.user, lib.log, params.userId, id, params.side)

        return area
    },
}
