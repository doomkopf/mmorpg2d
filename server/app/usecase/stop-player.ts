import { EntityFunc, FuncVisibility, StatelessFunc } from "../../tmp-api/core";
import { Area } from "../entity/area/Area";
import { areaUseCaseValidations } from "../entity/area/area-tools";
import { StopPlayerRequest } from "../game-shared/dto";
import { applyClientPosIfAcceptable } from "../tools";
import { userToArea } from "./tools/user-to-area";

export const stopPlayer: StatelessFunc<StopPlayerRequest> = {
  vis: FuncVisibility.pub,
  func: (lib, params, ctx) => {
    userToArea(lib.entityFunc, ctx, "stopPlayer1", params);
  },
};

export const stopPlayer1: EntityFunc<Area, StopPlayerRequest> = {
  vis: FuncVisibility.pri,
  func: (area, id, lib, params, ctx) => {
    if (!ctx.requestingUserId) {
      return;
    }

    area.update(lib, id);

    if (!areaUseCaseValidations(area, ctx.requestingUserId)) {
      return;
    }

    const pos = area.entities.positionables.get(ctx.requestingUserId);
    const movable = area.entities.movables.get(ctx.requestingUserId);

    const useClientPos = applyClientPosIfAcceptable(pos, params.pos);

    movable.stop(ctx.requestingUserId, area, lib.user, useClientPos ? ctx.requestingUserId : null);
  },
};
