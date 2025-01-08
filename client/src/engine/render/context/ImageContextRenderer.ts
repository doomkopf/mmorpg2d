import { ImageProvider } from "../../ImageProvider"
import { TILE_SIZE_IN_PIXEL } from "../../pixel"
import { Renderer } from "../Renderer"

export class ImageContextRenderer {
  /**
   * To not request non existing images over and over again
   */
  private readonly deadImageIds = new Set<string>()
  private readonly requestingImageIds = new Set<string>()

  constructor(
    private readonly rnd: Renderer,
    private readonly imageProvider: ImageProvider,
  ) {
  }

  drawTile(id: string, x: number, y: number): void {
    // adding offset of one pixel to fill gaps between tiles in non chrome browsers
    this.drawImage(id, x, y, TILE_SIZE_IN_PIXEL + 1, TILE_SIZE_IN_PIXEL + 1)
  }

  drawImage(id: string, x: number, y: number, w: number, h: number) {
    if (!this.isImageVisible(x, y)) {
      return
    }

    if (this.rnd.imageRnd.drawImage(id, x, y, w, h)) {
      return
    }

    if (this.deadImageIds.has(id)) {
      return
    }

    if (this.requestingImageIds.has(id)) {
      return
    }

    this.requestingImageIds.add(id)
    this.imageProvider.retrieveImage(id)
      .then(value => {
        this.requestingImageIds.delete(id)

        if (!value) {
          this.deadImageIds.add(id)
          return
        }

        if (this.rnd.imageRnd.isImageDeclared(id)) {
          return
        }

        this.rnd.imageRnd.declareImage(value, id)
      })
  }

  private isImageVisible(x: number, y: number): boolean {
    return x >= -TILE_SIZE_IN_PIXEL && y >= -TILE_SIZE_IN_PIXEL && x < this.rnd.getWidth() && y < this.rnd.getHeight()
  }
}
