import { JsonObject } from "../../../tmp-api/core"

export class AnimatedTile {
    constructor(
        private readonly imgIds: (string | null)[],
    ) {
        if (!imgIds.length) {
            throw "Animated tile must have at least one image"
        }
    }

    static fromObject(obj: JsonObject): AnimatedTile {
        return new AnimatedTile(obj.imgIds)
    }

    get readonlyImageIds() {
        return this.imgIds
    }

    addImage(id: string | null): void {
        this.imgIds.push(id)
    }
}
