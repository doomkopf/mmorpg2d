import { EntityFunc, FuncVisibility, StatelessFunc } from "gammaray-app/core";
import { mapTileObjectToDto } from "../../area-mapping";
import { Integer } from "../../engine-shared/Integer";
import { TileCoord } from "../../engine-shared/TileCoord";
import { Area } from "../../entity/area/Area";
import { areaUseCaseValidations } from "../../entity/area/area-tools";
import { DrawTileObjectsRequest, UpdateTileObjectsDto, UseCaseId } from "../../game-shared/dto";
import { userToArea } from "../tools/user-to-area";

export const drawTileObjects: StatelessFunc<DrawTileObjectsRequest> = {
  vis: FuncVisibility.pub,
  func: (lib, params, ctx) => {
    userToArea(lib.entityFunc, ctx, "drawTileObjects1", params);
  },
};

export const drawTileObjects1: EntityFunc<Area, DrawTileObjectsRequest> = {
  vis: FuncVisibility.pri,
  func: (area, id, lib, params, ctx) => {
    if (!ctx.requestingUserId) {
      return undefined;
    }

    area.update(lib, id);

    if (!areaUseCaseValidations(area, ctx.requestingUserId)) {
      return undefined;
    }

    area.objects.drawTileObjects(
      params.id,
      params.w,
      params.stackAnim,
      new TileCoord(
        new Integer(params.min.x),
        new Integer(params.min.y),
      ),
      new TileCoord(
        new Integer(params.max.x),
        new Integer(params.max.y),
      ),
    );

    const updateTileObjects: UpdateTileObjectsDto = {
      uc: UseCaseId.UPDATE_TILE_OBJECTS,
      objects: area.objects.readonlyArray.map(line => line.map(mapTileObjectToDto)),
    };
    area.sendToAllExcept(lib.user, updateTileObjects, null);

    return area;
  },
};
