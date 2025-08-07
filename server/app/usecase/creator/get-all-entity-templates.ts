import { FuncVisibility, StatelessFunc } from "../../../tmp-api/core";
import { ENTITY_TEMPLATES } from "../../game-data/entity-templates";

export const getAllEntityTemplates: StatelessFunc<never> = {
  vis: FuncVisibility.pub,
  func: (lib, params, ctx) => {
    ctx.sendResponse(ENTITY_TEMPLATES);
  },
};
