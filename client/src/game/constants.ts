import { Vector2D } from "../engine/shared/geom/Vector2D"

export const MOUSE_MOVE_EPSILON = 0.3

export const VECTOR_RIGHT = new Vector2D(1, 0)
export const VECTOR_DOWN = new Vector2D(0, 1)
export const VECTOR_LEFT = new Vector2D(-1, 0)
export const VECTOR_UP = new Vector2D(0, -1)

export const VECTOR_DOWN_RIGHT = new Vector2D(1, 1)
VECTOR_DOWN_RIGHT.normalize()
export const VECTOR_UP_RIGHT = new Vector2D(1, -1)
VECTOR_UP_RIGHT.normalize()
export const VECTOR_DOWN_LEFT = new Vector2D(-1, 1)
VECTOR_DOWN_LEFT.normalize()
export const VECTOR_UP_LEFT = new Vector2D(-1, -1)
VECTOR_UP_LEFT.normalize()

export enum ActorAnimation {
    IDLE,
    MOVE,
}
