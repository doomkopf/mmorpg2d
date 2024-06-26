import { FuncVisibility, StatelessFunc } from "gammaray-app/core";
import { LogLevel } from "gammaray-app/log";
import { STATUS_KEY, SetEntityTemplateRequest, StatusKey } from "../../game-shared/dto";

export const setEntityTemplate: StatelessFunc<SetEntityTemplateRequest> = {
  vis: FuncVisibility.pub,
  func: (lib, params, ctx) =>
  {
    lib.log.log(LogLevel.INFO, `TODO store template id=${params.id}`);
    ctx.sendResponse({ [STATUS_KEY]: StatusKey.OK });
  },
};
