import { EPSILON } from "../constants"
import { roughlyEquals } from "./math"

export class Vector2D {
    constructor(public x: number, public y: number) {
    }

    set(v: Vector2D): void {
        this.x = v.x
        this.y = v.y
    }

    add(v: Vector2D): void {
        this.x += v.x
        this.y += v.y
    }

    subtract(v: Vector2D): Vector2D {
        return new Vector2D(this.x - v.x, this.y - v.y)
    }

    scale(f: number): void {
        this.x *= f
        this.y *= f
    }

    lengthSq(): number {
        return (this.x * this.x) + (this.y * this.y)
    }

    lengthBySq(squaredLength: number): number {
        return Math.sqrt(squaredLength)
    }

    length(): number {
        return this.lengthBySq(this.lengthSq())
    }

    normalizeByLength(length: number): void {
        this.x /= length
        this.y /= length
    }

    normalize(): void {
        this.normalizeByLength(this.length())
    }

    rotate(rad: number): void {
        const { x, y } = this
        const cos = Math.cos(rad)
        const sin = Math.sin(rad)
        this.x = (x * cos) - (y * sin)
        this.y = (x * sin) + (y * cos)
    }

    distanceTo(p: Vector2D): number {
        return p.subtract(this).length()
    }

    roughlyEquals(v: Vector2D): boolean {
        return roughlyEquals(this.x, v.x, EPSILON) && roughlyEquals(this.y, v.y, EPSILON)
    }

    copy(): Vector2D {
        return new Vector2D(this.x, this.y)
    }
}
