import { EntityFunc, FuncVisibility, StatelessFunc } from "gammaray-app/core";
import { AllImagesInfo, DEFAULT_IMAGE_INFOS_ENTITY_ID } from "../../entity/all-images-info/AllImagesInfo";
import { SetImageNameRequest, SetImageNameResponse, StatusKey } from "../../game-shared/dto";

export const setImageName: StatelessFunc<SetImageNameRequest> = {
  vis: FuncVisibility.pub,
  func: (lib, params, ctx) => {
    lib.entityFunc.invoke("allimagesinfo", "setImageName1", DEFAULT_IMAGE_INFOS_ENTITY_ID, params, ctx);
  },
};

export const setImageName1: EntityFunc<AllImagesInfo, SetImageNameRequest> = {
  vis: FuncVisibility.pri,
  func: (info, id, lib, params, ctx) => {
    if (!info) {
      info = new AllImagesInfo({});
    }

    const name = info.setImageName(params.id, params.name);

    const response: SetImageNameResponse = {
      s: StatusKey.OK,
      name,
    };
    ctx.sendResponse(response);

    return info;
  },
};
