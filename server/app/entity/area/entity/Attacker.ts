import { JsonObject } from "../../../../tmp-api/core"
import { UserFunctions } from "../../../../tmp-api/user"
import { MOVABLE_BOUNDING_RADIUS } from "../../../engine-shared/constants"
import { Vector2D } from "../../../engine-shared/geom/Vector2D"
import { attackableToDto } from "../../../entity-mapping"
import { EntityAttackedDto, UpdateEntitiesDto, UseCaseId } from "../../../game-shared/dto"
import { Area } from "../Area"
import { Attackable } from "./Attackable"
import { EntitySystem } from "./EntitySystem"

enum Direction {
    DOWN,
    LEFT,
    UP,
    RIGHT,
}

export class Attacker {
    constructor(
        private readonly damage: number,
        readonly attackIntervalMs: number,
        readonly attackRange: number,
        private lastAttackTs: number,
    ) {
    }

    static fromObject(obj: JsonObject): Attacker {
        return new Attacker(
            obj.damage,
            obj.attackIntervalMs,
            obj.attackRange,
            obj.lastAttackTs,
        )
    }

    attack(id: string, area: Area, userFunctions: UserFunctions, userId: string | null): void {
        const now = Date.now()
        if (now - this.lastAttackTs < this.attackIntervalMs) {
            return
        }

        this.lastAttackTs = now

        const entityAttacked: EntityAttackedDto = {
            uc: UseCaseId.ATTACK,
            id,
        }
        area.sendToAllExcept(userFunctions, entityAttacked, userId)

        const hitAttackables: { id: string, attackable: Attackable }[] = []

        const movable = area.entities.movables.get(id)
        const dir = this.determineDirectionOf(movable.movable.dir)

        area.entities.attackables.iterate((attackableId, attackable) => {
            if (attackableId === id) {
                return
            }

            const attackablePos = area.entities.positionables.get(attackableId)
            const pos = area.entities.positionables.get(id)

            if (this.isInAttackRangeToPos(attackablePos, id, area.entities)) {
                if (dir === Direction.DOWN && attackablePos.y > pos.y
                    || dir === Direction.UP && attackablePos.y < pos.y
                    || dir === Direction.LEFT && attackablePos.x < pos.x
                    || dir === Direction.RIGHT && attackablePos.x > pos.x) {
                    attackable.gainDamage(this.damage, attackableId, area, userFunctions)
                    attackable.bounceAwayFrom(pos, attackableId, area.objects.currentCollisionModel, area.entities)

                    hitAttackables.push({ id: attackableId, attackable })
                }
            }
        })

        const updateEntities: UpdateEntitiesDto = {
            uc: UseCaseId.UPDATE_ENTITIES,
            entities: hitAttackables.map(att => {
                return {
                    id: att.id,
                    pos: area.entities.positionables.get(att.id),
                    attackable: attackableToDto(att.attackable),
                }
            }),
        }

        area.sendToAllExcept(userFunctions, updateEntities, null)
    }

    isInAttackRangeToPos(pos: Vector2D, id: string, entities: EntitySystem): boolean {
        return pos.distanceTo(entities.positionables.get(id)) <= this.attackRange + MOVABLE_BOUNDING_RADIUS
    }

    private determineDirectionOf(v: Vector2D): Direction {
        if (v.x >= 0 && v.y >= 0) {
            return v.x > v.y ? Direction.RIGHT : Direction.DOWN
        }
        if (v.x <= 0 && v.y >= 0) {
            return -v.x > v.y ? Direction.LEFT : Direction.DOWN
        }
        if (v.x <= 0 && v.y <= 0) {
            return -v.x > -v.y ? Direction.LEFT : Direction.UP
        }

        return v.x > -v.y ? Direction.RIGHT : Direction.UP
    }
}
