import { EntityFunc, EntityId, FuncVisibility } from "../../../tmp-api/core";
import { Lib } from "../../../tmp-api/lib";
import { LogLevel } from "../../../tmp-api/log";
import { Area } from "../../entity/area/Area";
import { areaUseCaseValidations } from "../../entity/area/area-tools";
import { User } from "../../entity/user/User";

export const userLoggedOut = (lib: Lib, userId: EntityId) => {
  lib.log.log(LogLevel.INFO, `Logging out: ${userId}`);

  lib.entityFunc.invoke("user", "userLoggedOut1", userId, {});
};

export const userLoggedOut1: EntityFunc<User, never> = {
  vis: FuncVisibility.pri,
  func: (user: User, id, lib) => {
    if (user && user.areaId) {
      lib.entityFunc.invoke("area", "userLoggedOut2", user.areaId, { userId: id });
      user.areaId = null;
    }
  },
};

export const userLoggedOut2: EntityFunc<Area, { userId: string }> = {
  vis: FuncVisibility.pri,
  func: (area: Area, id, lib, params) => {
    const { userId } = params;

    area.update(lib, id);

    if (!areaUseCaseValidations(area, userId)) {
      return;
    }

    area.removeUser(userId, id, lib.user, lib.log);
  },
};
