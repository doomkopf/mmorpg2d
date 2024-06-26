import { EntityFunc, FuncVisibility, StatelessFunc } from "gammaray-app/core";
import { AllImagesInfo, DEFAULT_IMAGE_INFOS_ENTITY_ID } from "../../entity/all-images-info/AllImagesInfo";
import { Image } from "../../entity/image/Image";
import { StatusKey, UploadImageRequest, UploadImageResponse } from "../../game-shared/dto";

export const uploadImage: StatelessFunc<UploadImageRequest> = {
  vis: FuncVisibility.pub,
  func: (lib, params, ctx) =>
  {
    // TODO admin check

    const imgId = params.id || lib.tools.randomUUID();
    lib.entityFunc.invoke("image", "uploadImage1", imgId, params, ctx);
  },
};

export const uploadImage1: EntityFunc<Image, UploadImageRequest> = {
  vis: FuncVisibility.pri,
  func: (image, id, lib, params, ctx) =>
  {
    if (!image)
    {
      image = { url: "" };
    }

    let isNew: boolean;
    if (image.url)
    {
      isNew = false;
    }
    else
    {
      isNew = true;

      // adding info async since it is only important for creators
      lib.entityFunc.invoke("allimagesinfo", "uploadImage2", DEFAULT_IMAGE_INFOS_ENTITY_ID, { id }, ctx);
    }

    image.url = params.url;

    const response: UploadImageResponse = {
      s: StatusKey.OK,
      imgId: id,
      isNew,
    };
    ctx.sendResponse(response);

    return image;
  },
};

export const uploadImage2: EntityFunc<AllImagesInfo, { id: string }> = {
  vis: FuncVisibility.pri,
  func: (info: AllImagesInfo, id, lib, params) =>
  {
    if (!info)
    {
      info = new AllImagesInfo({});
    }

    info.addImageInfo(params.id);
    return info;
  },
};
