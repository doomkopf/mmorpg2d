import { CollisionModel } from "../../engine-shared/CollisionModel"
import { TileCoord } from "../../engine-shared/TileCoord"
import { AnimatedTile } from "./AnimatedTile"
import { TileObject } from "./TileObject"

export class Objects {
    private collisionModel: CollisionModel

    constructor(
        private readonly objects: (TileObject | null)[][],
    ) {
        this.collisionModel = new CollisionModel(this)
    }

    get readonlyArray() {
        return this.objects
    }

    get currentCollisionModel(): CollisionModel {
        return this.collisionModel
    }

    drawTileObjects(id: string | null, walkable: boolean, stack: boolean, min: TileCoord, max: TileCoord): void {
        for (let y = min.y.value; y <= max.y.value; y++) {
            const objectsLine = this.objects[y]
            for (let x = min.x.value; x <= max.x.value; x++) {
                if (stack) {
                    let obj = objectsLine[x]
                    if (!obj) {
                        obj = new TileObject(new AnimatedTile([id]), walkable)
                        objectsLine[x] = obj
                    } else {
                        obj.anim.addImage(id)
                    }
                } else {
                    objectsLine[x] = id ? new TileObject(new AnimatedTile([id]), walkable) : null
                }
            }
        }

        this.rebuildCollisionModel()
    }

    private rebuildCollisionModel(): void {
        this.collisionModel = new CollisionModel(this)
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

    getObjectAtTile(x: number, y: number): TileObject | null {
        return this.objects[y][x]
    }
}
