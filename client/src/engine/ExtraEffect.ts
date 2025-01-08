import { Color } from "./Color"
import { Vector2D } from "./shared/geom/Vector2D"

export class ExtraEffect {
  constructor(
    readonly pos: Vector2D,
    readonly text: string | null,
    readonly temp: Color,
  ) {
  }
}
