import { Area } from "../../Area"
import { coordsToPixels, HALF_TILE_SIZE_IN_PIXEL } from "../../pixel"
import { HALF_TILE_SIZE_IN_COORDS } from "../../shared/constants"
import { Renderer } from "../Renderer"
import { ImageContextRenderer } from "./ImageContextRenderer"
import { VisiblesRenderer } from "./VisiblesRenderer"

const QUARTER_TILE_SIZE_IN_COORDS = HALF_TILE_SIZE_IN_COORDS / 2

export class AreaRenderer {
  constructor(
    private readonly rnd: Renderer,
    private readonly imageRenderer: ImageContextRenderer,
    private readonly visiblesRenderer: VisiblesRenderer,
  ) {
  }

  renderArea(area: Area, w2: number, h2: number, motionScaleFactor: number, now: number) {
    const cam = area.camera

    for (let y = 0; y < area.height; y++) {
      for (let x = 0; x < area.width; x++) {
        const pixels = coordsToPixels(x + HALF_TILE_SIZE_IN_COORDS, y + HALF_TILE_SIZE_IN_COORDS, w2, h2, cam)
        this.imageRenderer.drawTile(area.getFloorAtTile(x, y), pixels.x, pixels.y)
      }
    }

    for (let y = 0; y < area.height; y++) {
      for (let x = 0; x < area.width; x++) {
        const tileObject = area.getObjectAtTile(x, y)
        if (tileObject) {
          tileObject.anim.update(now)
          const { imgId } = tileObject.anim
          if (imgId) {
            const pixels = coordsToPixels(x + HALF_TILE_SIZE_IN_COORDS, y + HALF_TILE_SIZE_IN_COORDS, w2, h2, cam)
            this.imageRenderer.drawTile(imgId, pixels.x, pixels.y)
          }
        }
      }
    }

    area.iterateExtraEffects(extraEffect => {
      this.rnd.fillColor(extraEffect.temp.r, extraEffect.temp.g, extraEffect.temp.b)

      const pixels = coordsToPixels(
        extraEffect.pos.x - QUARTER_TILE_SIZE_IN_COORDS,
        extraEffect.pos.y - QUARTER_TILE_SIZE_IN_COORDS,
        w2,
        h2,
        cam,
      )
      this.rnd.drawRect(
        pixels.x,
        pixels.y,
        pixels.x + HALF_TILE_SIZE_IN_PIXEL,
        pixels.y + HALF_TILE_SIZE_IN_PIXEL,
      )

      if (extraEffect.text) {
        this.rnd.textColor(0, 0, 0)
        this.rnd.drawText(extraEffect.text, pixels.x, pixels.y)
      }
    })

    this.visiblesRenderer.renderVisibles(area.entities.visibles, w2, h2, cam, motionScaleFactor)

    for (let y = 0; y < area.height; y++) {
      for (let x = 0; x < area.width; x++) {
        const air = area.getAirAtTile(x, y)
        if (air) {
          const pixels = coordsToPixels(x + HALF_TILE_SIZE_IN_COORDS, y + HALF_TILE_SIZE_IN_COORDS, w2, h2, cam)
          this.imageRenderer.drawTile(air, pixels.x, pixels.y)
        }
      }
    }
  }
}
