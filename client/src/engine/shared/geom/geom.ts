import { Vector2D } from "./Vector2D"

export function calcTile(p: Vector2D): { x: number, y: number } {
    return { x: calcTileDimension(p.x), y: calcTileDimension(p.y) }
}

function calcTileDimension(d: number): number {
    return Math.round(d)
}

export function lineIntersectsLine(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
    const numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)
    const numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)

    if (denom == 0) {
        if (numeA == 0 && numeB == 0) {
            return false // COLLINEAR
        }

        return false // PARALLEL
    }

    const uA = numeA / denom
    const uB = numeB / denom

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return true
    }

    return false
}
