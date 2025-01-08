import { Visible } from "./entity/Visible"
import { HALF_TILE_SIZE_IN_COORDS } from "./shared/constants"
import { Vector2D } from "./shared/geom/Vector2D"

export class BlendingVisible implements Visible {
  private readonly p: Vector2D

  constructor(
    private readonly visible: Visible,
  ) {
    this.p = visible.pos.copy()
  }

  get pos() {
    return this.p
  }

  get imgId() {
    return this.visible.imgId
  }

  get lineFromCenter() {
    return this.visible.lineFromCenter
  }

  get topValueBar() {
    return this.visible.topValueBar
  }

  get bottomValueBar() {
    return this.visible.bottomValueBar
  }

  refresh(motionScaleFactor: number): void {
    if (this.visible.refresh) {
      this.visible.refresh(motionScaleFactor)
    }

    const v = this.visible.pos.subtract(this.pos)
    const distance = v.length()
    if (distance > HALF_TILE_SIZE_IN_COORDS) {
      v.normalizeByLength(distance)
      v.scale(2 * motionScaleFactor)
      this.p.add(v)
    }
    else {
      this.p.set(this.visible.pos)
    }
  }
}
