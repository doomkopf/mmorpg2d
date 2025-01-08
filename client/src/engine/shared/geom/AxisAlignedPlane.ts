import { Vector2D } from "./Vector2D"

export class AxisAlignedPlane {
  /**
   * If isX is true, the plane moves on the x dimension so visually it would look like a vertical line with its normal pointing to either left or right
   */
  constructor(
    readonly isX: boolean,
    readonly isPositive: boolean,
    readonly d: number,
  ) {
  }

  /**
   * Classifies a point in relation to this plane.
   * @returns negative: behind plane, 0: on plane, positive: in front of plane
   */
  classifyPoint(p: Vector2D): number {
    if (this.isX) {
      if (this.isPositive) {
        return p.x - this.d
      }
      return this.d - p.x
    }

    if (this.isPositive) {
      return p.y - this.d
    }
    return this.d - p.y
  }
}
