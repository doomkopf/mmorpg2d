import { percentageToPixel } from "../pixel"
import { Coord } from "./Coord"
import { PixelRect } from "./PixelRect"
import { WindowColor } from "./WindowColor"

export interface ButtonListener {
  onButtonClick(): void
}

export class Button {
  private pix: PixelRect | null = null

  constructor(
    private readonly topLeft: Coord,
    private readonly bottomRight: Coord,
    readonly color: WindowColor,
    readonly textColor: WindowColor,
    readonly text: string,
    private readonly listener: ButtonListener | null,
  ) {
  }

  pixelRect(parentX: number, parentY: number, parentW: number, parentH: number): PixelRect {
    if (this.pix) {
      return this.pix
    }

    this.pix = new PixelRect(
      {
        x: parentX + percentageToPixel(this.topLeft.x, parentW),
        y: parentY + percentageToPixel(this.topLeft.y, parentH),
      },
      {
        x: parentX + percentageToPixel(this.bottomRight.x, parentW),
        y: parentY + percentageToPixel(this.bottomRight.y, parentH),
      },
    )

    return this.pix
  }

  onClick(x: number, y: number) {
    if (this.listener && this.pix && this.pix.isPosInside(x, y)) {
      this.listener.onButtonClick()
    }
  }
}
