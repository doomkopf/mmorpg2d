import { TileCoord } from "../../engine-shared/TileCoord"

export class Floor {
    constructor(
        private readonly floor: string[][],
    ) {
    }

    get readonlyArray() {
        return this.floor
    }

    get sizeY(): number {
        return this.floor.length
    }

    get sizeX(): number {
        return this.floor[0].length
    }

    drawFloor(id: string, min: TileCoord, max: TileCoord): void {
        for (let y = min.y.value; y <= max.y.value; y++) {
            const floorLine = this.floor[y]
            for (let x = min.x.value; x <= max.x.value; x++) {
                floorLine[x] = id
            }
        }
    }
}
