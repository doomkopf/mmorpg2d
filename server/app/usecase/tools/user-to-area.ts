import { EntityFunc, EntityFunctions, FuncContext, FuncVisibility, JsonObject } from "gammaray-app/core";
import { LogLevel } from "gammaray-app/log";
import { User } from "../../entity/user/User";

export function userToArea(
  entityFuncs: EntityFunctions,
  ctx: FuncContext,
  areaFunc: string,
  params: JsonObject | null,
): void {
  if (!ctx.requestingUserId) {
    return;
  }

  const p: UserToArea = {
    f: areaFunc,
    p: params,
  };
  entityFuncs.invoke("user", "userToArea1", ctx.requestingUserId, p, ctx);
}

interface UserToArea {
  f: string;
  p: JsonObject | null;
}

export const userToArea1: EntityFunc<User, UserToArea> = {
  vis: FuncVisibility.pri,
  func: (user, id, lib, params, ctx) => {
    if (!user) {
      lib.log.log(LogLevel.WARN, `UserToArea: User ${id} not present`);
      return;
    }

    if (!user.areaId) {
      lib.log.log(LogLevel.WARN, `UserToArea: User ${id} has no area assignment`);
      return;
    }

    lib.entityFunc.invoke("area", params.f, user.areaId, params.p, ctx);
  },
};
