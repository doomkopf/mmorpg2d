import { DeserializeEntity } from "gammaray-app/core";
import { AllImagesInfo } from "./AllImagesInfo";

export const allimagesinfoDeserializeEntity: DeserializeEntity<AllImagesInfo> = (id, entity) => {
  return new AllImagesInfo(entity.infos);
};
