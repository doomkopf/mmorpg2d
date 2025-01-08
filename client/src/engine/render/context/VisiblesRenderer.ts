import { LineFromCenter, ValueBar, Visible } from "../../entity/Visible"
import { coordsToPixels, HALF_TILE_SIZE_IN_PIXEL, TILE_SIZE_IN_PIXEL } from "../../pixel"
import { HALF_TILE_SIZE_IN_COORDS } from "../../shared/constants"
import { EntityComponents } from "../../shared/entity/EntityComponents"
import { Vector2D } from "../../shared/geom/Vector2D"
import { Renderer } from "../Renderer"
import { ImageContextRenderer } from "./ImageContextRenderer"

const VALUE_BAR_BORDER_SIZE = 2
const VALUE_BAR_HEIGHT = 20

export class VisiblesRenderer {
  constructor(
    private readonly rnd: Renderer,
    private readonly imageRenderer: ImageContextRenderer,
  ) {
  }

  renderVisibles(visibles: EntityComponents<Visible>, w2: number, h2: number, cam: Vector2D, motionScaleFactor: number): void {
    visibles.iterate((id, visible) => {
      if (visible.refresh) {
        visible.refresh(motionScaleFactor)
      }

      if (visible.lineFromCenter) {
        this.renderLineFromCenter(visible.lineFromCenter, visible.pos, w2, h2, cam)
      }

      const pixels = coordsToPixels(visible.pos.x - HALF_TILE_SIZE_IN_COORDS, visible.pos.y - HALF_TILE_SIZE_IN_COORDS, w2, h2, cam)
      this.imageRenderer.drawImage(visible.imgId, pixels.x, pixels.y, TILE_SIZE_IN_PIXEL, TILE_SIZE_IN_PIXEL)
    })

    visibles.iterate((id, visible) => {
      if (visible.topValueBar) {
        const pixels = coordsToPixels(visible.pos.x, visible.pos.y, w2, h2, cam)
        const x1 = pixels.x - HALF_TILE_SIZE_IN_PIXEL
        const y1 = pixels.y - TILE_SIZE_IN_PIXEL
        const x2 = x1 + TILE_SIZE_IN_PIXEL
        const y2 = y1 + VALUE_BAR_HEIGHT
        this.renderValueBar(visible.topValueBar, x1, y1, x2, y2)
      }

      if (visible.bottomValueBar) {
        const pixels = coordsToPixels(visible.pos.x, visible.pos.y, w2, h2, cam)
        const x1 = pixels.x - HALF_TILE_SIZE_IN_PIXEL
        const y1 = pixels.y + HALF_TILE_SIZE_IN_PIXEL
        const x2 = x1 + TILE_SIZE_IN_PIXEL
        const y2 = y1 + VALUE_BAR_HEIGHT
        this.renderValueBar(visible.bottomValueBar, x1, y1, x2, y2)
      }
    })
  }

  private renderValueBar(
    bar: ValueBar,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) {
    this.rnd.fillColor(50, 50, 50)
    this.rnd.drawRect(x1, y1, x2, y2)

    if (bar.v > 0) {
      this.rnd.fillColor(0, 200, 0)
      this.rnd.drawRect(
        x1 + VALUE_BAR_BORDER_SIZE,
        y1 + VALUE_BAR_BORDER_SIZE,
        x1 + ((bar.v / bar.maxV) * ((x2 - VALUE_BAR_BORDER_SIZE) - x1)),
        y2 - VALUE_BAR_BORDER_SIZE,
      )
    }
  }

  private renderLineFromCenter(line: LineFromCenter, pos: Vector2D, w2: number, h2: number, cam: Vector2D) {
    const c = line.color
    this.rnd.strokeColor(c.r, c.g, c.b)

    const to = pos.copy()
    to.add(line.vector)

    const fromPix = coordsToPixels(pos.x, pos.y, w2, h2, cam)
    const toPix = coordsToPixels(to.x, to.y, w2, h2, cam)
    this.rnd.drawLine(fromPix.x, fromPix.y, toPix.x, toPix.y, line.width)
  }
}
