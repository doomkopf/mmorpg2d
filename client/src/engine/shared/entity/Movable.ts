import { CollisionModel } from "../CollisionModel"
import { GLOBAL_SPEED_FACTOR } from "../constants"
import { Vector2D } from "../geom/Vector2D"

export class Movable {
    private readonly moveV = new Vector2D(0, 0)

    constructor(
        private readonly pos: Vector2D,
        private moving: boolean,
        public dir: Vector2D,
        private speed: number,
    ) {
    }

    set(dirX: number, dirY: number, moving: boolean, speed: number): void {
        this.dir.x = dirX
        this.dir.y = dirY
        this.moving = moving
        this.speed = speed
    }

    changeSpeed(speed: number): void {
        this.speed = speed
    }

    update(motionScaleFactor: number, collisionModel: CollisionModel): void {
        if (!this.moving) {
            return
        }

        this.moveV.set(this.dir)
        this.moveV.scale(GLOBAL_SPEED_FACTOR * this.speed * motionScaleFactor)

        const origin = new Vector2D(this.pos.x, this.pos.y)
        this.pos.add(this.moveV)
        collisionModel.alterDestination(origin, this.pos)
    }

    get currentSpeed(): number {
        return this.speed
    }

    get isMoving(): boolean {
        return this.moving
    }

    lookInDirectionTo(x: number, y: number): void {
        if (this.pos.x === x && this.pos.y === y) {
            return
        }

        let dir = new Vector2D(x, y)
        dir = dir.subtract(this.pos)
        dir.normalize()
        this.dir = dir
    }

    moveInDirectionTo(x: number, y: number): void {
        this.lookInDirectionTo(x, y)
        this.moving = true
    }

    moveInDirection(dir: Vector2D): void {
        this.dir = dir
        this.moving = true
    }

    // lookInDirection is just setting dir directly

    /**
     * @returns true if it was moving
     */
    stop(): boolean {
        const wasMoving = this.moving
        this.moving = false
        return wasMoving
    }
}
