import { EPSILON, MOVABLE_BOUNDING_RADIUS } from "./constants"
import { AxisAlignedPlane } from "./geom/AxisAlignedPlane"
import { lineIntersectsLine } from "./geom/geom"
import { Vector2D } from "./geom/Vector2D"

interface Line {
    p1: Vector2D
    p2: Vector2D
    plane: AxisAlignedPlane
}

export class CollisionRectangle {
    private readonly tLine: Line
    private readonly rLine: Line
    private readonly bLine: Line
    private readonly lLine: Line

    constructor(min: Vector2D, max: Vector2D) {
        min.x -= MOVABLE_BOUNDING_RADIUS
        min.y -= MOVABLE_BOUNDING_RADIUS
        max.x += MOVABLE_BOUNDING_RADIUS
        max.y += MOVABLE_BOUNDING_RADIUS

        this.tLine = {
            p1: new Vector2D(min.x, min.y),
            p2: new Vector2D(max.x, min.y),
            plane: new AxisAlignedPlane(false, false, min.y),
        }

        this.rLine = {
            p1: new Vector2D(max.x, min.y),
            p2: new Vector2D(max.x, max.y),
            plane: new AxisAlignedPlane(true, true, max.x),
        }

        this.bLine = {
            p1: new Vector2D(max.x, max.y),
            p2: new Vector2D(min.x, max.y),
            plane: new AxisAlignedPlane(false, true, max.y),
        }

        this.lLine = {
            p1: new Vector2D(min.x, max.y),
            p2: new Vector2D(min.x, min.y),
            plane: new AxisAlignedPlane(true, false, min.x),
        }
    }

    alterDestination(origin: Vector2D, dest: Vector2D): void {
        CollisionRectangle.alterAgainstLine(origin, dest, this.tLine)
        CollisionRectangle.alterAgainstLine(origin, dest, this.rLine)
        CollisionRectangle.alterAgainstLine(origin, dest, this.bLine)
        CollisionRectangle.alterAgainstLine(origin, dest, this.lLine)
    }

    private static alterAgainstLine(origin: Vector2D, dest: Vector2D, line: Line) {
        if (lineIntersectsLine(
            origin.x,
            origin.y,
            dest.x,
            dest.y,
            line.p1.x,
            line.p1.y,
            line.p2.x,
            line.p2.y,
        )) {
            const { plane } = line

            // if origin is front and since it intersects, dest must be back
            if (plane.classifyPoint(origin) >= 0) {
                if (plane.isX) {
                    dest.x = plane.d
                    dest.x += plane.isPositive ? EPSILON : -EPSILON
                } else {
                    dest.y = plane.d
                    dest.y += plane.isPositive ? EPSILON : -EPSILON
                }
            }
        }
    }
}
