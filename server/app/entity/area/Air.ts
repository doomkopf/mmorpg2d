import { TileCoord } from "../../engine-shared/TileCoord"

export class Air {
    constructor(
        private readonly air: (string | null)[][],
    ) {
    }

    get readonlyArray() {
        return this.air
    }

    draw(id: string | null, min: TileCoord, max: TileCoord): void {
        for (let y = min.y.value; y <= max.y.value; y++) {
            const line = this.air[y]
            for (let x = min.x.value; x <= max.x.value; x++) {
                line[x] = id
            }
        }
    }
}
