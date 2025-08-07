import { UserFunctions } from "../../../../tmp-api/user";
import { CollisionModel } from "../../../engine-shared/CollisionModel";
import { HALF_TILE_SIZE_IN_COORDS, TILE_SIZE_IN_COORDS } from "../../../engine-shared/constants";
import { Vector2D } from "../../../engine-shared/geom/Vector2D";
import { EntityDiedDto, UseCaseId } from "../../../game-shared/dto";
import { Area } from "../Area";

export class Attackable {
  private diedAtTs = 0;

  constructor(
    readonly pos: Vector2D,
    readonly maxHp: number,
    private hp: number,
    public isVisible: boolean,
  ) {
  }

  get hitpoints(): number {
    return this.hp;
  }

  get isAlive(): boolean {
    return this.hp > 0;
  }

  get diedAtTimestamp(): number {
    return this.diedAtTs;
  }

  gainDamage(damage: number, id: string, area: Area, userFunctions: UserFunctions): void {
    if (!this.isAlive) {
      return;
    }

    this.hp -= damage;
    if (this.hp < 0) {
      this.hp = 0;
    }

    if (!this.isAlive) {
      this.diedAtTs = Date.now();

      const entityDied: EntityDiedDto = {
        uc: UseCaseId.DEATH,
        id,
      };
      area.sendToAllExcept(userFunctions, entityDied, null);
    }
  }

  bounceAwayFrom(pos: Vector2D, collisionModel: CollisionModel): void {
    const v = this.pos.subtract(pos);
    v.normalize();
    v.scale(TILE_SIZE_IN_COORDS + HALF_TILE_SIZE_IN_COORDS);

    const origin = this.pos.copy();
    this.pos.add(v);

    collisionModel.alterDestination(origin, this.pos);
  }
}
