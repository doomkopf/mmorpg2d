import { EntityFunc, FuncVisibility, StatelessFunc } from "../../../tmp-api/core";
import { AllImagesInfo, DEFAULT_IMAGE_INFOS_ENTITY_ID } from "../../entity/all-images-info/AllImagesInfo";
import { Image } from "../../entity/image/Image";
import { RemoveImageRequest, RemoveImageResponse, StatusKey } from "../../game-shared/dto";
import { sendResponseWithClientRequestId } from "../../tools";

export const removeImage: StatelessFunc<RemoveImageRequest> = {
  vis: FuncVisibility.pub,
  func: (lib, params) => {
    // TODO admin check

    lib.entityFunc.invoke("image", "removeImage1", params.id, null);
  },
};

export const removeImage1: EntityFunc<Image, never> = {
  vis: FuncVisibility.pri,
  func: (image, id, lib, params, ctx) => {
    if (!image) {
      const response: RemoveImageResponse = {
        s: StatusKey.NONE,
      };
      sendResponseWithClientRequestId(ctx, response)
      return undefined;
    }

    lib.entityFunc.invoke("allimagesinfo", "removeImage2", DEFAULT_IMAGE_INFOS_ENTITY_ID, { id });

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
    sendResponseWithClientRequestId(ctx, response)

    return info;
  },
};
