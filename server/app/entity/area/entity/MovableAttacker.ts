import { JsonObject } from "../../../../tmp-api/core"
import { UserFunctions } from "../../../../tmp-api/user"
import { Vector2D } from "../../../engine-shared/geom/Vector2D"
import { Faction } from "../../../game-shared/entity/template/Faction"
import { Area } from "../Area"
import { EntitySystem } from "./EntitySystem"

export const IDLE_SPEED = 5

export class MovableAttacker {
    constructor(
        private readonly normalSpeed: number,
        private readonly viewRange: number,
        private idlingSinceTs: number,
        private targetId: string | null,
    ) {
    }

    static fromObject(obj: JsonObject): MovableAttacker {
        return new MovableAttacker(
            obj.normalSpeed,
            obj.viewRange,
            obj.idlingSinceTs,
            obj.targetId,
        )
    }

    update(id: string, area: Area, userFunctions: UserFunctions): void {
        const entities = area.entities

        const attackable = entities.attackables.get(id)
        if (attackable && !attackable.isAlive) {
            this.stopIfMoving(id, area, userFunctions)
            return
        }

        if (Math.random() < 0.8) {
            return
        }

        const movable = entities.movables.get(id)

        // determine target
        if (this.targetId) {
            const targetAttackable = area.entities.attackables.get(this.targetId)
            if (!targetAttackable || !targetAttackable.isAlive) {
                this.targetId = null
                this.stopIfMoving(id, area, userFunctions)
                movable.changeSpeed(IDLE_SPEED, id, area, userFunctions, null)
                return
            }
        } else {
            this.targetId = this.findAttackableId(id, entities)
            if (!this.targetId) {
                // move or stand around randomly
                const now = Date.now()
                if (now - this.idlingSinceTs > 3000) {
                    if (Math.random() < 0.5) {
                        this.idlingSinceTs = now
                        const v = new Vector2D(Math.random() - 0.5, Math.random() - 0.5)
                        v.normalize()
                        movable.moveInDirection(v, id, area, userFunctions, null)
                    } else {
                        this.stopIfMoving(id, area, userFunctions)
                    }
                }
                return
            } else {
                movable.changeSpeed(this.normalSpeed, id, area, userFunctions, null)
            }
        }

        // determine whether to attack or move
        const targetPos = entities.positionables.get(this.targetId)
        const attacker = entities.attackers.get(id)
        if (attacker.isInAttackRangeToPos(targetPos, id, entities)) {
            this.stopIfMoving(id, area, userFunctions)
            movable.lookInDirectionTo(targetPos.x, targetPos.y, id, area, userFunctions, null)
            attacker.attack(id, area, userFunctions, null)
        } else {
            movable.moveInDirectionTo(
                targetPos.x,
                targetPos.y,
                id,
                area,
                userFunctions,
                null,
            )
        }
    }

    private findAttackableId(id: string, entities: EntitySystem): string | null {
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

            const attackablePos = entities.positionables.get(attackableId)
            const myPos = entities.positionables.get(id)
            const distance = attackablePos.distanceTo(myPos)
            if (distance <= this.viewRange) {
                return attackableId
            }
        }

        return null
    }

    private stopIfMoving(id: string, area: Area, userFunctions: UserFunctions) {
        const movable = area.entities.movables.get(id)
        if (movable.movable.isMoving) {
            movable.stop(id, area, userFunctions, null)
        }
    }
}
