import { EntityFunc, FuncVisibility, StatelessFunc } from "gammaray-app/core";
import { AllImagesInfo, DEFAULT_IMAGE_INFOS_ENTITY_ID } from "../../entity/all-images-info/AllImagesInfo";
import { Image } from "../../entity/image/Image";
import { RemoveImageRequest, RemoveImageResponse, StatusKey } from "../../game-shared/dto";

export const removeImage: StatelessFunc<RemoveImageRequest> = {
  vis: FuncVisibility.pub,
  func: (lib, params, ctx) => {
    // TODO admin check

    lib.entityFunc.invoke("image", "removeImage1", params.id, null, ctx);
  },
};

export const removeImage1: EntityFunc<Image, never> = {
  vis: FuncVisibility.pri,
  func: (image, id, lib, params, ctx) => {
    if (!image) {
      const response: RemoveImageResponse = {
        s: StatusKey.NONE,
      };
      ctx.sendResponse(response);
      return undefined;
    }

    lib.entityFunc.invoke("allimagesinfo", "removeImage2", DEFAULT_IMAGE_INFOS_ENTITY_ID, { id }, ctx);

    return "delete";
  },
};

export const removeImage2: EntityFunc<AllImagesInfo, { id: string }> = {
  vis: FuncVisibility.pri,
  func: (info, id, lib, params, ctx) => {
    info.removeImageInfo(params.id);

    const response: RemoveImageResponse = {
      s: StatusKey.OK,
    };
    ctx.sendResponse(response);

    return info;
  },
};
