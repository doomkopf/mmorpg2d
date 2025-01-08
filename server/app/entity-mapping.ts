import { Movable } from "./engine-shared/entity/Movable";
import { Attackable } from "./entity/area/entity/Attackable";
import { Attacker } from "./entity/area/entity/Attacker";
import { EntitySystem } from "./entity/area/entity/EntitySystem";
import { AttackableDto, AttackerDto, EntityDto, MovableDto } from "./game-shared/dto";

export function entityToDto(id: string, entities: EntitySystem): EntityDto {
  const serverMovable = entities.movables.get(id);
  const attackable = entities.attackables.get(id);
  const attacker = entities.attackers.get(id);

  return {
    id,
    pos: entities.positionables.get(id),
    movable: serverMovable ? movableToDto(serverMovable.movable) : undefined,
    attackable: attackable ? attackableToDto(attackable) : undefined,
    attacker: attacker ? attackerToDto(attacker) : undefined,
    humanoidAnimations: entities.humanoidAnimations.get(id),
  };
}

function movableToDto(mov: Movable): MovableDto {
  return {
    dir: mov.dir,
    isMoving: mov.isMoving,
    speed: mov.currentSpeed,
  };
}

export function attackableToDto(attackable: Attackable): AttackableDto {
  return {
    maxHp: attackable.maxHp,
    hp: attackable.hitpoints,
  };
}

function attackerToDto(attacker: Attacker): AttackerDto {
  return {
    attackRange: attacker.attackRange,
    attackIntervalMs: attacker.attackIntervalMs,
  };
}
