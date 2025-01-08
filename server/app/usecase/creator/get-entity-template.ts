import { FuncVisibility, StatelessFunc } from "gammaray-app/core";
import { GetEntityTemplateRequest, GetEntityTemplateResponse, STATUS_KEY, StatusKey } from "../../game-shared/dto";
import { getEntityTemplate } from "../../tools";

export const getEntityTemplateFunc: StatelessFunc<GetEntityTemplateRequest> = {
  vis: FuncVisibility.pub,
  func: (lib, params, ctx) => {
    const response: GetEntityTemplateResponse = {
      [STATUS_KEY]: StatusKey.OK,
      template: getEntityTemplate(params.id) || undefined,
    };
    ctx.sendResponse(response);
  },
};
