import { AreaInputListener, EngineAppContext } from "./Engine"

export class AreaInputDispatcher {
    private readonly listeners = new Set<AreaInputListener>()

    constructor(
        private readonly ctx: EngineAppContext,
    ) {
    }

    addListener(l: AreaInputListener): void {
        this.listeners.add(l)
    }

    dispatchClick(x: number, y: number): void {
        for (const l of this.listeners) {
            try {
                if (l.onClick) {
                    l.onClick(this.ctx, x, y)
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    dispatchDoubleClick(x: number, y: number): void {
        for (const l of this.listeners) {
            try {
                if (l.onDoubleClick) {
                    l.onDoubleClick(this.ctx, x, y)
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    dispatchMouseDown(x: number, y: number): void {
        for (const l of this.listeners) {
            try {
                if (l.onMouseDown) {
                    l.onMouseDown(this.ctx, x, y)
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    dispatchMouseUp(x: number, y: number): void {
        for (const l of this.listeners) {
            try {
                if (l.onMouseUp) {
                    l.onMouseUp(this.ctx, x, y)
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    dispatchMouseMove(x: number, y: number): void {
        for (const l of this.listeners) {
            try {
                if (l.onMouseMove) {
                    l.onMouseMove(this.ctx, x, y)
                }
            } catch (err) {
                console.error(err)
            }
        }
    }
}
