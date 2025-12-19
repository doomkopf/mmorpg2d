import { JsonObject } from "../../../../tmp-api/core"
import { EntityComponents } from "../../../engine-shared/entity/EntityComponents"
import { Movable } from "../../../engine-shared/entity/Movable"
import { Vector2D } from "../../../engine-shared/geom/Vector2D"
import { EntityTemplate } from "../../../game-shared/entity/template/entity-template"
import { Faction } from "../../../game-shared/entity/template/Faction"
import { mapObjectValues } from "../../../tools"
import { Attackable } from "./Attackable"
import { Attacker } from "./Attacker"
import { HumanoidAnimations } from "./HumanoidAnimations"
import { IDLE_SPEED, MovableAttacker } from "./MovableAttacker"
import { ServerMovable } from "./ServerMovable"

export function createEmptyEntitySystem(): EntitySystem {
    return new EntitySystem(
        new EntityComponents<Vector2D>({}),
        new EntityComponents<ServerMovable>({}),
        new EntityComponents<Attackable>({}),
        new EntityComponents<Attacker>({}),
        new EntityComponents<MovableAttacker>({}),
        new EntityComponents<HumanoidAnimations>({}),
        new EntityComponents<Faction>({}),
    )
}

export class EntitySystem {
    constructor(
        readonly positionables: EntityComponents<Vector2D>,
        readonly movables: EntityComponents<ServerMovable>,
        readonly attackables: EntityComponents<Attackable>,
        readonly attackers: EntityComponents<Attacker>,
        readonly movableAttackers: EntityComponents<MovableAttacker>,
        readonly humanoidAnimations: EntityComponents<HumanoidAnimations>,
        readonly factions: EntityComponents<Faction>,
    ) {
    }

    static fromObject(obj: JsonObject): EntitySystem {
        const positionables = new EntityComponents(mapObjectValues(
            obj.positionables.components as Record<string, JsonObject>,
            raw => new Vector2D(raw.x, raw.y),
        ))

        return new EntitySystem(
            positionables,
            new EntityComponents(mapObjectValues(
                obj.movables.components as Record<string, JsonObject>,
                (raw, key) => ServerMovable.fromObject(raw, positionables.get(key)),
            )),
            new EntityComponents(mapObjectValues(
                obj.attackables.components as Record<string, JsonObject>,
                raw => Attackable.fromObject(raw),
            )),
            new EntityComponents(mapObjectValues(
                obj.attackers.components as Record<string, JsonObject>,
                raw => Attacker.fromObject(raw),
            )),
            new EntityComponents(mapObjectValues(
                obj.movableAttackers.components as Record<string, JsonObject>,
                raw => MovableAttacker.fromObject(raw),
            )),
            new EntityComponents(obj.humanoidAnimations.components),
            new EntityComponents(obj.factions.components),
        )
    }

    removeEntity(id: string): void {
        this.positionables.remove(id)
        this.movables.remove(id)
        this.attackables.remove(id)
        this.attackers.remove(id)
        this.movableAttackers.remove(id)
        this.humanoidAnimations.remove(id)
        this.factions.remove(id)
    }

    createEntityFromTemplate(
        id: string,
        pos: Vector2D,
        template: EntityTemplate,
    ): void {
        this.positionables.put(id, pos)

        let movable: ServerMovable | undefined
        if (template.movable) {
            movable = new ServerMovable(new Movable(pos, new Vector2D(0, 0), false, new Vector2D(0, 1), template.movable.speed))
            this.movables.put(id, movable)
        }

        if (template.attackable) {
            this.attackables.put(id, new Attackable(template.attackable.maxHp, template.attackable.hp, true, 0))
        }

        let attacker: Attacker | undefined
        if (template.attacker) {
            attacker = new Attacker(
                template.attacker.damage,
                template.attacker.attackIntervalMs,
                template.attacker.attackRange,
                0,
            )
            this.attackers.put(id, attacker)
        }

        if (template.movableAttacker && template.movable && movable) {
            movable.movable.changeSpeed(IDLE_SPEED)
            this.movableAttackers.put(
                id,
                new MovableAttacker(
                    template.movable.speed,
                    template.movableAttacker.viewRange,
                    0,
                    null,
                ),
            )
        }

        if (template.humanoidAnimations) {
            this.humanoidAnimations.put(id, template.humanoidAnimations)
        }

        if (template.faction) {
            this.factions.put(id, template.faction)
        }
    }
}
