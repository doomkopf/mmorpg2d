import { EntityFunc, FuncVisibility } from "../../tmp-api/core";
import { Image } from "../entity/image/Image";
import { GetImageResponse } from "../game-shared/dto";

export const getImage: EntityFunc<Image, never> = {
  vis: FuncVisibility.pub,
  func: (image, id, lib, params, ctx) => {
    if (!image) {
      const response: GetImageResponse = {};
      ctx.sendResponse(response);
      return;
    }

    const response: GetImageResponse = {
      url: image.url,
    };
    ctx.sendResponse(response);
  },
};
