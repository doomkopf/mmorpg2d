import { EntitySystem } from "./entity/EntitySystem"
import { ExtraEffect } from "./ExtraEffect"
import { CollisionModel } from "./shared/CollisionModel"
import { Vector2D } from "./shared/geom/Vector2D"
import { TileObject } from "./TileObject"

export class Area {
    readonly entities = new EntitySystem()

    private camAttachedTo: Vector2D | null = null

    private collModel: CollisionModel

    constructor(
        private floor: string[][],
        private objects: (TileObject | null)[][],
        private air: (string | null)[][],
        private extraEffects: ExtraEffect[],
        private readonly cam: Vector2D,
    ) {
        this.collModel = new CollisionModel(this)
    }

    get width(): number {
        return this.floor[0].length
    }

    get height(): number {
        return this.floor.length
    }

    get camera(): Vector2D {
        return this.cam
    }

    private rebuildCollisionModel(): void {
        this.collModel = new CollisionModel(this)
    }

    getFloorAtTile(x: number, y: number): string {
        return this.floor[y][x]
    }

    getObjectAtTile(x: number, y: number): TileObject | null {
        return this.objects[y][x]
    }

    getAirAtTile(x: number, y: number): string | null {
        return this.air[y][x]
    }

    get collisionModel(): CollisionModel {
        return this.collModel
    }

    get sizeY(): number {
        return this.objects.length
    }

    get sizeX(): number {
        return this.objects[0].length
    }

    isSolidTile(x: number, y: number): boolean {
        const obj = this.getObjectAtTile(x, y)
        return !!obj && !obj.isWalkable
    }

    replaceExtraEffects(extraEffects: ExtraEffect[]): void {
        this.extraEffects = extraEffects
    }

    iterateExtraEffects(func: (extraEffect: ExtraEffect) => void): void {
        this.extraEffects.forEach(func)
    }

    fixCamera(x: number, y: number): void {
        this.cam.x = x
        this.cam.y = y
    }

    attachCameraToVisible(entityId: string): void {
        const visible = this.entities.visibles.get(entityId)
        if (visible) {
            this.camAttachedTo = visible.pos
        }
    }

    detachCamera(): void {
        this.camAttachedTo = null
    }

    replaceFloor(floor: string[][]): void {
        this.floor = floor
    }

    replaceTileObjects(objects: (TileObject | null)[][]): void {
        this.objects = objects
        this.rebuildCollisionModel()
    }

    replaceAir(air: (string | null)[][]): void {
        this.air = air
    }

    update(motionScaleFactor: number): void {
        this.entities.movables.iterate((id, movable) => {
            movable.update(motionScaleFactor, this.collisionModel)
        })

        if (this.camAttachedTo) {
            this.cam.x = this.camAttachedTo.x
            this.cam.y = this.camAttachedTo.y
        }
    }
}
