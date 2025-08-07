import { EntityFunc, FuncVisibility, StatelessFunc } from "../../../tmp-api/core";
import { AllImagesInfo, DEFAULT_IMAGE_INFOS_ENTITY_ID } from "../../entity/all-images-info/AllImagesInfo";
import { GetAllImageInfosResponse } from "../../game-shared/dto";

export const getAllImageInfos: StatelessFunc<never> = {
  vis: FuncVisibility.pub,
  func: (lib) => {
    lib.entityFunc.invoke("allimagesinfo", "getAllImageInfos1", DEFAULT_IMAGE_INFOS_ENTITY_ID, null);
  },
};

export const getAllImageInfos1: EntityFunc<AllImagesInfo, never> = {
  vis: FuncVisibility.pri,
  func: (info, id, lib, params, ctx) => {
    if (!info) {
      const response: GetAllImageInfosResponse = {
        infos: {},
      };
      ctx.sendResponse(response);
      return;
    }

    const response: GetAllImageInfosResponse = {
      infos: info.readonlyImageInfos,
    };
    ctx.sendResponse(response);
  },
};
