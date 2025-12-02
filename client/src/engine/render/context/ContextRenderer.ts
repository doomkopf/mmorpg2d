import { Context } from "../../Context"
import { Renderer } from "../Renderer"
import { AreaRenderer } from "./AreaRenderer"
import { WindowRenderer } from "./WindowRenderer"

export class ContextRenderer {
    constructor(
        private readonly rnd: Renderer,
        private readonly areaRenderer: AreaRenderer,
        private readonly windowRenderer: WindowRenderer,
    ) {
    }

    renderContext(ctx: Context, motionScaleFactor: number, now: number): void {
        const w2 = this.rnd.getWidth() / 2
        const h2 = this.rnd.getHeight() / 2

        this.rnd.fillColor(0, 0, 0)
        this.rnd.clear()

        const { area } = ctx
        if (area) {
            this.areaRenderer.renderArea(area, w2, h2, motionScaleFactor, now)
        }

        this.windowRenderer.renderWindows(ctx.windows)

        this.rnd.present()
    }
}
