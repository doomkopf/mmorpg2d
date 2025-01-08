export const DEFAULT_IMAGE_INFOS_ENTITY_ID = "def";

export interface ImageInfo {
  name: string;
}

export class AllImagesInfo {
  constructor(
    private readonly infos: { [id: string]: ImageInfo },
  ) { }

  addImageInfo(id: string): void {
    this.infos[id] = {
      name: "",
    };
  }

  setImageName(id: string, name: string): string {
    const info = this.infos[id];

    name = name.toLowerCase();
    info.name = name;

    return name;
  }

  removeImageInfo(id: string): void {
    delete this.infos[id];
  }

  get readonlyImageInfos(): { [id: string]: ImageInfo } {
    return this.infos;
  }
}
