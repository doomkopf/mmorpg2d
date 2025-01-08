import { ImageProvider } from "../engine/ImageProvider"
import { ItemSelectionGridListener, SelectableItem } from "../engine/window/ItemSelectionGrid"
import { GameContext } from "./GameContext"
import { ImageDropListener, registerImageDropListener } from "./image-drop"
import {
  GetAllImageInfosResponse,
  GetImageResponse,
  SetImageNameRequest,
  SetImageNameResponse,
  STATUS_KEY,
  StatusKey,
  UploadImageRequest,
  UploadImageResponse,
  UseCaseId,
} from "./shared/dto"

export interface ImageInfo {
  id: string
  name: string
}

export class ImageManager implements ImageProvider, ImageDropListener, ItemSelectionGridListener {
  // TODO replace with persistent/cachy store
  private readonly map = new Map<string, string>()
  private readonly allImages: ImageInfo[] = []

  constructor(
    private readonly gameCtx: GameContext,
  ) {
    registerImageDropListener(this)
  }

  async onImageDrop(dataUrl: string, x: number, y: number): Promise<void> {
    const grid = this.gameCtx.imageSelectionGrid
    if (!grid) {
      return
    }

    const request: UploadImageRequest = {
      url: dataUrl,
      id: grid.findItemAt(x, y)?.id,
    }
    const response = await this.gameCtx.server.request(UseCaseId.UPLOAD_IMAGE, "", "", request) as UploadImageResponse
    if (response[STATUS_KEY] === StatusKey.OK && response.imgId) {
      if (response.isNew) {
        this.map.set(response.imgId, dataUrl)
        grid.addItem({ id: response.imgId, imgId: response.imgId, name: "" })
      }
      else {
        this.map.delete(response.imgId)
      }
    }
  }

  onItemClick(): void {
    //
  }

  async onItemDoubleClick(item: SelectableItem): Promise<void> {
    if (!item.imgId) {
      return
    }

    const newName = prompt(item.imgId, item.name)
    if (newName && newName !== item.name) {
      const request: SetImageNameRequest = {
        id: item.id,
        name: newName,
      }
      const response = await this.gameCtx.server.request(UseCaseId.SET_IMAGE_NAME, "", "", request) as SetImageNameResponse
      if (response[STATUS_KEY] !== StatusKey.OK) {
        console.error(response[STATUS_KEY])
        return
      }

      item.name = response.name
    }
  }

  async retrieveImage(id: string): Promise<string | undefined> {
    const url = this.map.get(id)
    if (url) {
      return url
    }

    const response: GetImageResponse = await this.gameCtx.server.request(UseCaseId.GET_IMAGE, "image", id, {})
    if (response.url) {
      this.map.set(id, response.url)
    }

    return response.url
  }

  async retrieveAllImagesInfo(): Promise<ImageInfo[]> {
    const response = await this.gameCtx.server.request(UseCaseId.GET_ALL_IMAGE_INFOS, "", "", {}) as GetAllImageInfosResponse

    const infos: ImageInfo[] = []
    for (const id in response.infos) {
      const info = response.infos[id]
      infos.push({ id, name: info.name })
    }

    for (const img of this.allImages) {
      infos.push(img)
    }

    return infos
  }
}
