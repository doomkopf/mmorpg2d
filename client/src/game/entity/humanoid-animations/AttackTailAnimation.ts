import { LineFromCenter } from "../../../engine/entity/Visible"
import { Vector2D } from "../../../engine/shared/geom/Vector2D"
import { Direction } from "../../Direction"

const HALF_CIRCLE_IN_RADIANS = 3.14159
const ANIM_SPEED_FACTOR = 2

export class AttackTailAnimation {
  private readonly line = {
    vector: new Vector2D(0, 0),
    color: { r: 255, g: 255, b: 255, a: 0 },
    width: 10,
  }

  private rotated = -1

  constructor(
    private readonly range: number,
  ) {
  }

  get lineFromCenter(): LineFromCenter | undefined {
    return this.isRunning ? this.line : undefined
  }

  startForDirection(dir: Direction): void {
    this.rotated = 0

    switch (dir) {
      case Direction.DOWN:
        this.line.vector.x = -this.range
        this.line.vector.y = 0
        break
      case Direction.LEFT:
        this.line.vector.x = 0
        this.line.vector.y = -this.range
        break
      case Direction.UP:
        this.line.vector.x = this.range
        this.line.vector.y = 0
        break
      case Direction.RIGHT:
        this.line.vector.x = 0
        this.line.vector.y = this.range
        break
    }
  }

  update(motionScaleFactor: number): void {
    if (this.isRunning) {
      const rad = ANIM_SPEED_FACTOR * motionScaleFactor
      this.line.vector.rotate(-rad)
      this.rotated += rad
      if (this.rotated >= HALF_CIRCLE_IN_RADIANS) {
        this.rotated = -1
      }
    }
  }

  private get isRunning(): boolean {
    return this.rotated !== -1
  }
}
