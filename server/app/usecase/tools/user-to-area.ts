import { EntityFunc, EntityFunctions, FuncVisibility, JsonObject, RequestContext } from "../../../tmp-api/core";
import { LogLevel } from "../../../tmp-api/log";
import { User } from "../../entity/user/User";

export function userToArea(
  entityFuncs: EntityFunctions,
  ctx: RequestContext,
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
  entityFuncs.invoke("user", "userToArea1", ctx.requestingUserId, p);
}

interface UserToArea {
  f: string;
  p: JsonObject | null;
}

export const userToArea1: EntityFunc<User, UserToArea> = {
  vis: FuncVisibility.pri,
  func: (user, id, lib, params) => {
    if (!user) {
      lib.log.log(LogLevel.WARN, `UserToArea: User ${id} not present`);
      return;
    }

    if (!user.areaId) {
      lib.log.log(LogLevel.WARN, `UserToArea: User ${id} has no area assignment`);
      return;
    }

    lib.entityFunc.invoke("area", params.f, user.areaId, params.p);
  },
};
