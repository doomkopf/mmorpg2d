import { CollisionRectangle } from "./CollisionRectangle"
import { HALF_TILE_SIZE_IN_COORDS, MOVABLE_BOUNDING_RADIUS } from "./constants"
import { Vector2D } from "./geom/Vector2D"

export class CollisionModel {
    private readonly minX: number
    private readonly maxX: number
    private readonly minY: number
    private readonly maxY: number

    private readonly rects: Array<CollisionRectangle> = []

    constructor(
        tileMap: {
            sizeY: number
            sizeX: number
            isSolidTile(x: number, y: number): boolean
        },
    ) {
        // If one day we need different bounding radii, remove this constant
        this.minX = HALF_TILE_SIZE_IN_COORDS + MOVABLE_BOUNDING_RADIUS
        this.minY = HALF_TILE_SIZE_IN_COORDS + MOVABLE_BOUNDING_RADIUS
        this.maxX = (tileMap.sizeX + HALF_TILE_SIZE_IN_COORDS) - MOVABLE_BOUNDING_RADIUS
        this.maxY = (tileMap.sizeY + HALF_TILE_SIZE_IN_COORDS) - MOVABLE_BOUNDING_RADIUS

        // Calc a rectangle for each tile which works for now
        for (let y = 0; y < tileMap.sizeY; y++) {
            for (let x = 0; x < tileMap.sizeX; x++) {
                if (tileMap.isSolidTile(x, y)) {
                    const xCoord = x + 1
                    const yCoord = y + 1
                    this.rects.push(new CollisionRectangle(
                        new Vector2D(xCoord - HALF_TILE_SIZE_IN_COORDS, yCoord - HALF_TILE_SIZE_IN_COORDS),
                        new Vector2D(xCoord + HALF_TILE_SIZE_IN_COORDS, yCoord + HALF_TILE_SIZE_IN_COORDS),
                    ))
                }
            }
        }
    }

    alterDestination(origin: Vector2D, dest: Vector2D): void {
        this.alterOutOfBounds(dest)

        for (const rect of this.rects) {
            rect.alterDestination(origin, dest)
        }
    }

    private alterOutOfBounds(dest: Vector2D) {
        if (dest.x < this.minX) {
            dest.x = this.minX
        }
        if (dest.x > this.maxX) {
            dest.x = this.maxX
        }
        if (dest.y < this.minY) {
            dest.y = this.minY
        }
        if (dest.y > this.maxY) {
            dest.y = this.maxY
        }
    }
}
