import { UserFunctions } from "../../../../tmp-api/user"
import { Vector2D } from "../../../engine-shared/geom/Vector2D"
import { Faction } from "../../../game-shared/entity/template/Faction"
import { Area } from "../Area"
import { Attackable } from "./Attackable"
import { Attacker } from "./Attacker"
import { EntitySystem } from "./EntitySystem"
import { ServerMovable } from "./ServerMovable"

interface Target {
    id: string
    att: Attackable
}

const IDLE_SPEED = 5

export class MovableAttacker {
    private readonly normalSpeed: number

    private idlingAroundSinceTs = 0

    private target: Target | null = null

    constructor(
        private readonly pos: Vector2D,
        private readonly movable: ServerMovable,
        private readonly attacker: Attacker,
        private readonly viewRange: number,
        private readonly attackable: Attackable | null,
    ) {
        this.normalSpeed = movable.movable.currentSpeed
        movable.movable.changeSpeed(IDLE_SPEED)
    }

    update(id: string, area: Area, userFunctions: UserFunctions): void {
        if (this.attackable && !this.attackable.isAlive) {
            this.stopIfMoving(id, area, userFunctions)
            return
        }

        if (Math.random() < 0.8) {
            return
        }

        // determine target
        if (this.target) {
            const att = area.entities.attackables.get(this.target.id)
            if (!this.target.att.isAlive || !att || att !== this.target.att) {
                this.target = null
                this.stopIfMoving(id, area, userFunctions)
                this.movable.changeSpeed(IDLE_SPEED, id, area, userFunctions, null)
                return
            }
        } else {
            this.target = this.findAttackable(id, area.entities)
            if (!this.target) {
                // move or stand around randomly
                const now = Date.now()
                if (now - this.idlingAroundSinceTs > 3000) {
                    if (Math.random() < 0.5) {
                        this.idlingAroundSinceTs = now
                        const v = new Vector2D(Math.random() - 0.5, Math.random() - 0.5)
                        v.normalize()
                        this.movable.moveInDirection(v, id, area, userFunctions, null)
                    } else {
                        this.stopIfMoving(id, area, userFunctions)
                    }
                }
                return
            } else {
                this.movable.changeSpeed(this.normalSpeed, id, area, userFunctions, null)
            }
        }

        // determine whether to attack or move
        if (this.attacker.isInAttackRangeToPos(this.target.att.pos)) {
            this.stopIfMoving(id, area, userFunctions)
            this.movable.lookInDirectionTo(this.target.att.pos.x, this.target.att.pos.y, id, area, userFunctions, null)
            this.attacker.attack(id, area, userFunctions, null)
        } else {
            this.movable.moveInDirectionTo(
                this.target.att.pos.x,
                this.target.att.pos.y,
                id,
                area,
                userFunctions,
                null,
            )
        }
    }

    private findAttackable(id: string, entities: EntitySystem): Target | null {
        for (const attackableId of entities.attackables.idsIterable) {
            if (attackableId === id) {
                continue
            }

            const faction = entities.factions.get(attackableId)
            if (faction !== Faction.PLAYER) {
                continue
            }

            const attackable = entities.attackables.get(attackableId)

            if (!attackable.isVisible) {
                continue
            }

            const distance = attackable.pos.distanceTo(this.pos)
            if (distance <= this.viewRange) {
                return { id: attackableId, att: attackable }
            }
        }

        return null
    }

    private stopIfMoving(id: string, area: Area, userFunctions: UserFunctions) {
        if (this.movable.movable.isMoving) {
            this.movable.stop(id, area, userFunctions, null)
        }
    }
}
