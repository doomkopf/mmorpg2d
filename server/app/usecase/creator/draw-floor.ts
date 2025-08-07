import { EntityFunc, FuncVisibility, StatelessFunc } from "../../../tmp-api/core";
import { Integer } from "../../engine-shared/Integer";
import { TileCoord } from "../../engine-shared/TileCoord";
import { Area } from "../../entity/area/Area";
import { areaUseCaseValidations } from "../../entity/area/area-tools";
import { DrawFloorRequest, UpdateFloorDto, UseCaseId } from "../../game-shared/dto";
import { userToArea } from "../tools/user-to-area";

export const drawFloor: StatelessFunc<DrawFloorRequest> = {
  vis: FuncVisibility.pub,
  func: (lib, params, ctx) => {
    userToArea(lib.entityFunc, ctx, "drawFloor1", params);
  },
};

export const drawFloor1: EntityFunc<Area, DrawFloorRequest> = {
  vis: FuncVisibility.pri,
  func: (area, id, lib, params, ctx) => {
    if (!ctx.requestingUserId) {
      return undefined;
    }

    if (!areaUseCaseValidations(area, ctx.requestingUserId)) {
      return undefined;
    }

    area.floor.drawFloor(
      params.id,
      new TileCoord(
        new Integer(params.min.x),
        new Integer(params.min.y),
      ),
      new TileCoord(
        new Integer(params.max.x),
        new Integer(params.max.y),
      ),
    );

    const updateFloor: UpdateFloorDto = {
      uc: UseCaseId.UPDATE_FLOOR,
      floor: area.floor.readonlyArray,
    };
    area.sendToAllExcept(lib.user, updateFloor, null);

    return area;
  },
};
