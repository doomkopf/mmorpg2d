import { EntityFunc, FuncVisibility, StatelessFunc } from "../../../tmp-api/core";
import { Integer } from "../../engine-shared/Integer";
import { TileCoord } from "../../engine-shared/TileCoord";
import { Area } from "../../entity/area/Area";
import { areaUseCaseValidations } from "../../entity/area/area-tools";
import { DrawAirRequest, UpdateAirDto, UseCaseId } from "../../game-shared/dto";
import { userToArea } from "../tools/user-to-area";

export const drawAir: StatelessFunc<DrawAirRequest> = {
  vis: FuncVisibility.pub,
  func: (lib, params, ctx) => {
    userToArea(lib.entityFunc, ctx, "drawAir1", params);
  },
};

export const drawAir1: EntityFunc<Area, DrawAirRequest> = {
  vis: FuncVisibility.pri,
  func: (area, id, lib, params, ctx) => {
    if (!ctx.requestingUserId) {
      return undefined;
    }

    if (!areaUseCaseValidations(area, ctx.requestingUserId)) {
      return undefined;
    }

    area.air.draw(params.id || null,
      new TileCoord(new Integer(params.min.x), new Integer(params.min.y)),
      new TileCoord(new Integer(params.max.x), new Integer(params.max.y)),
    );

    const updateAir: UpdateAirDto = {
      uc: UseCaseId.UPDATE_AIR,
      air: area.air.readonlyArray,
    };
    area.sendToAllExcept(lib.user, updateAir, null);

    return area;
  },
};
