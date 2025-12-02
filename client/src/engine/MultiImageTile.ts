import { AnimatedTile } from "./AnimatedTile"
import { Animation } from "./Animation"

export class MultiImageTile implements AnimatedTile {
    private readonly anim: Animation

    constructor(
        imgIds: (string | null)[],
    ) {
        this.anim = new Animation(imgIds, 500, true)
        this.anim.start(Date.now())
    }

    get imgId(): string | null {
        return this.anim.currentImageId
    }

    update(now: number): void {
        this.anim.update(now)
    }
}
