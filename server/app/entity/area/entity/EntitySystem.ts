import { EntityComponents } from "../../../engine-shared/entity/EntityComponents";
import { Movable } from "../../../engine-shared/entity/Movable";
import { Vector2D } from "../../../engine-shared/geom/Vector2D";
import { EntityTemplate } from "../../../game-shared/entity/template/entity-template";
import { Faction } from "../../../game-shared/entity/template/Faction";
import { Attackable } from "./Attackable";
import { Attacker } from "./Attacker";
import { HumanoidAnimations } from "./HumanoidAnimations";
import { MovableAttacker } from "./MovableAttacker";
import { ServerMovable } from "./ServerMovable";

export function createEmptyEntitySystem(): EntitySystem {
  return new EntitySystem(
    new EntityComponents<Vector2D>({}),
    new EntityComponents<ServerMovable>({}),
    new EntityComponents<Attackable>({}),
    new EntityComponents<Attacker>({}),
    new EntityComponents<MovableAttacker>({}),
    new EntityComponents<HumanoidAnimations>({}),
    new EntityComponents<Faction>({}),
  );
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

  removeEntity(id: string): void {
    this.positionables.remove(id);
    this.movables.remove(id);
    this.attackables.remove(id);
    this.attackers.remove(id);
    this.movableAttackers.remove(id);
    this.humanoidAnimations.remove(id);
    this.factions.remove(id);
  }

  createEntityFromTemplate(
    id: string,
    pos: Vector2D,
    template: EntityTemplate,
  ): void {
    this.positionables.put(id, pos);

    let movable: ServerMovable | undefined;
    if (template.movable) {
      movable = new ServerMovable(pos, new Movable(pos, false, new Vector2D(0, 1), template.movable.speed));
      this.movables.put(id, movable);
    }

    if (template.attackable) {
      this.attackables.put(id, new Attackable(pos, template.attackable.maxHp, template.attackable.hp, true));
    }

    let attacker: Attacker | undefined;
    if (template.attacker && movable) {
      attacker = new Attacker(
        pos,
        movable.movable,
        template.attacker.damage,
        template.attacker.attackIntervalMs,
        template.attacker.attackRange,
      );
      this.attackers.put(id, attacker);
    }

    if (template.movableAttacker && movable && attacker) {
      this.movableAttackers.put(
        id,
        new MovableAttacker(
          pos,
          movable,
          attacker,
          template.movableAttacker.viewRange,
          this.attackables.get(id),
        ),
      );
    }

    if (template.humanoidAnimations) {
      this.humanoidAnimations.put(id, template.humanoidAnimations);
    }

    if (template.faction) {
      this.factions.put(id, template.faction);
    }
  }
}
