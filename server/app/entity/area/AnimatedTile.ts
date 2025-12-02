export class AnimatedTile {
    constructor(
        private readonly imgIds: (string | null)[],
    ) {
        if (!imgIds.length) {
            throw "Animated tile must have at least one image"
        }
    }

    get readonlyImageIds() {
        return this.imgIds
    }

    addImage(id: string | null): void {
        this.imgIds.push(id)
    }
}
