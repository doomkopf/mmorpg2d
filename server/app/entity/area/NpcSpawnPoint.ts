import { Tools } from "gammaray-app/tools";
import { UserFunctions } from "gammaray-app/user";
import { Vector2D } from "../../engine-shared/geom/Vector2D";
import { EntityTemplate } from "../../game-shared/entity/template/entity-template";
import { Area } from "./Area";
import { Attackable } from "./entity/Attackable";

const RESPAWN_TIME_MS = 120000;

export class NpcSpawnPoint {
  private attackable: Attackable | null = null;
  private deadSinceTs = 0;

  constructor(
    readonly templateId: string,
    readonly template: EntityTemplate,
    readonly pos: Vector2D,
  ) {
  }

  update(area: Area, tools: Tools, userFunctions: UserFunctions): void {
    if (this.attackable) {
      if (!this.attackable.isAlive) {
        if (!this.deadSinceTs) {
          this.deadSinceTs = Date.now();
        }
        else if (Date.now() - this.deadSinceTs >= RESPAWN_TIME_MS) {
          this.deadSinceTs = 0;
          this.attackable = null;
        }
      }
    }
    else {
      const id = area.createEntityFromTemplate(
        tools.randomUUID(),
        this.pos.copy(),
        this.template,
        userFunctions,
        null,
      );
      this.attackable = area.entities.attackables.get(id);
    }
  }
}
