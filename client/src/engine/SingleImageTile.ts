import { AnimatedTile } from "./AnimatedTile"

export class SingleImageTile implements AnimatedTile {
    constructor(
        readonly imgId: string | null,
    ) {
    }

    update(): void {
        //
    }
}
