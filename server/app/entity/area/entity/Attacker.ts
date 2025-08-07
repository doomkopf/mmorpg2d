import { UserFunctions } from "../../../../tmp-api/user";
import { MOVABLE_BOUNDING_RADIUS } from "../../../engine-shared/constants";
import { Movable } from "../../../engine-shared/entity/Movable";
import { Vector2D } from "../../../engine-shared/geom/Vector2D";
import { attackableToDto } from "../../../entity-mapping";
import { EntityAttackedDto, UpdateEntitiesDto, UseCaseId } from "../../../game-shared/dto";
import { Area } from "../Area";
import { Attackable } from "./Attackable";

enum Direction {
  DOWN,
  LEFT,
  UP,
  RIGHT,
}

export class Attacker {
  private lastAttackTs = 0;

  constructor(
    private readonly pos: Vector2D,
    private readonly movable: Movable,
    private readonly damage: number,
    readonly attackIntervalMs: number,
    readonly attackRange: number,
  ) {
  }

  attack(id: string, area: Area, userFunctions: UserFunctions, userId: string | null): void {
    const now = Date.now();
    if (now - this.lastAttackTs < this.attackIntervalMs) {
      return;
    }

    this.lastAttackTs = now;

    const entityAttacked: EntityAttackedDto = {
      uc: UseCaseId.ATTACK,
      id,
    };
    area.sendToAllExcept(userFunctions, entityAttacked, userId);

    const hitAttackables: { id: string, attackable: Attackable }[] = [];

    const dir = this.determineDirectionOf(this.movable.dir);

    area.entities.attackables.iterate((attackableId, attackable) => {
      if (attackableId === id) {
        return;
      }

      if (this.isInAttackRangeToPos(attackable.pos)) {
        if (dir === Direction.DOWN && attackable.pos.y > this.pos.y
          || dir === Direction.UP && attackable.pos.y < this.pos.y
          || dir === Direction.LEFT && attackable.pos.x < this.pos.x
          || dir === Direction.RIGHT && attackable.pos.x > this.pos.x) {
          attackable.gainDamage(this.damage, attackableId, area, userFunctions);
          attackable.bounceAwayFrom(this.pos, area.objects.currentCollisionModel);

          hitAttackables.push({ id: attackableId, attackable });
        }
      }
    });

    const updateEntities: UpdateEntitiesDto = {
      uc: UseCaseId.UPDATE_ENTITIES,
      entities: hitAttackables.map(att => {
        return {
          id: att.id,
          pos: att.attackable.pos,
          attackable: attackableToDto(att.attackable),
        };
      }),
    };

    area.sendToAllExcept(userFunctions, updateEntities, null);
  }

  isInAttackRangeToPos(pos: Vector2D): boolean {
    return pos.distanceTo(this.pos) <= this.attackRange + MOVABLE_BOUNDING_RADIUS;
  }

  private determineDirectionOf(v: Vector2D): Direction {
    if (v.x >= 0 && v.y >= 0) {
      return v.x > v.y ? Direction.RIGHT : Direction.DOWN;
    }
    if (v.x <= 0 && v.y >= 0) {
      return -v.x > v.y ? Direction.LEFT : Direction.DOWN;
    }
    if (v.x <= 0 && v.y <= 0) {
      return -v.x > -v.y ? Direction.LEFT : Direction.UP;
    }

    return v.x > -v.y ? Direction.RIGHT : Direction.UP;
  }
}
