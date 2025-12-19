import { JsonObject } from "../../../tmp-api/core"
import { AnimatedTile } from "./AnimatedTile"

export class TileObject {
    constructor(
        readonly anim: AnimatedTile,
        readonly isWalkable: boolean,
    ) {
    }

    static fromObject(obj: JsonObject): TileObject {
        return new TileObject(
            AnimatedTile.fromObject(obj.anim),
            obj.isWalkable,
        )
    }
}
