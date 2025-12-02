import { Color } from "../Color"
import { Vector2D } from "../shared/geom/Vector2D"

export interface LineFromCenter {
    vector: Vector2D
    color: Color
    width: number
}

export interface ValueBar {
    maxV: number
    v: number
}

export interface Visible {
    readonly pos: Vector2D
    readonly imgId: string

    refresh?(motionScaleFactor: number): void

    readonly lineFromCenter?: LineFromCenter

    readonly topValueBar?: ValueBar

    readonly bottomValueBar?: ValueBar
}
