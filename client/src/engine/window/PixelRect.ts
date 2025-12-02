import { isPosInsideRect } from "../pixel"

export class PixelRect {
    constructor(
        readonly min: PixelPos,
        readonly max: PixelPos,
    ) {
    }

    isPosInside(x: number, y: number): boolean {
        return isPosInsideRect(x, y, this.min.x, this.min.y, this.max.x, this.max.y)
    }
}

interface PixelPos {
    x: number
    y: number
}
