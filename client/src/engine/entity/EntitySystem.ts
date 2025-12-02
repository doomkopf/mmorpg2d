import { EntityComponents } from "../shared/entity/EntityComponents"
import { Movable } from "../shared/entity/Movable"
import { Vector2D } from "../shared/geom/Vector2D"
import { Visible } from "./Visible"

export class EntitySystem {
    readonly positionables = new EntityComponents<Vector2D>({})
    readonly movables = new EntityComponents<Movable>({})
    readonly visibles = new EntityComponents<Visible>({})

    removeEntity(id: string): void {
        this.positionables.remove(id)
        this.movables.remove(id)
        this.visibles.remove(id)
    }
}
