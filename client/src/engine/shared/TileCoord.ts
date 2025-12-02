import { HALF_TILE_SIZE_IN_COORDS } from "./constants"
import { Vector2D } from "./geom/Vector2D"
import { Integer } from "./Integer"

export class TileCoord {
    static fromAreaCoords(x: number, y: number): TileCoord {
        return new TileCoord(new Integer(x - HALF_TILE_SIZE_IN_COORDS), new Integer(y - HALF_TILE_SIZE_IN_COORDS))
    }

    constructor(
        readonly x: Integer,
        readonly y: Integer,
    ) {
        if (x.value < 0 || y.value < 0) {
            throw "One of the coordinates is negative"
        }
    }

    toAreaCoords(): Vector2D {
        return new Vector2D(this.x.value + 1, this.y.value + 1)
    }
}
