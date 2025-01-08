import { EntityFunc, FuncVisibility, StatelessFunc } from "gammaray-app/core";
import { Vector2D } from "../../engine-shared/geom/Vector2D";
import { Area } from "../../entity/area/Area";
import { areaUseCaseValidations } from "../../entity/area/area-tools";
import { PlaceEntityRequest } from "../../game-shared/dto";
import { getEntityTemplate } from "../../tools";
import { userToArea } from "../tools/user-to-area";

export const placeEntity: StatelessFunc<PlaceEntityRequest> = {
  vis: FuncVisibility.pub,
  func: (lib, params, ctx) => {
    userToArea(lib.entityFunc, ctx, "placeEntity1", params);
  },
};

export const placeEntity1: EntityFunc<Area, PlaceEntityRequest> = {
  vis: FuncVisibility.pri,
  func: (area, id, lib, params, ctx) => {
    if (!ctx.requestingUserId) {
      return undefined;
    }

    area.update(lib, id);

    if (!areaUseCaseValidations(area, ctx.requestingUserId)) {
      return undefined;
    }

    const template = getEntityTemplate(params.templateId);
    if (!template) {
      return undefined;
    }

    area.createEntityFromTemplate(
      lib.tools.randomUUID(),
      new Vector2D(params.pos.x, params.pos.y),
      template,
      lib.user,
      null,
    );

    return area;
  },
};
