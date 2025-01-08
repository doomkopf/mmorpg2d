import { JsonObject } from "gammaray-app/core";
import { Lib } from "gammaray-app/lib";
import { LogLevel, Logger } from "gammaray-app/log";
import { UserFunctions } from "gammaray-app/user";
import { mapAreaToDto } from "../../area-mapping";
import { CORPSE_TIMEOUT_MS } from "../../contants";
import { Vector2D } from "../../engine-shared/geom/Vector2D";
import { calcMotionScaleFactor } from "../../engine-shared/tools";
import { entityToDto } from "../../entity-mapping";
import { PLAYER_TEMPLATE } from "../../game-data/entity-templates";
import { DespawnEntityDto, JoinAreaDto, SpawnEntityDto, UseCaseId } from "../../game-shared/dto";
import { EntityTemplate } from "../../game-shared/entity/template/entity-template";
import { startJoinArea } from "../../usecase/internal/join-area";
import { Air } from "./Air";
import { Floor } from "./Floor";
import { NpcSpawnPoints } from "./NpcSpawnPoints";
import { Objects } from "./Objects";
import { SurroundingAreas } from "./SurroundingAreas";
import { areaId, oppositeOfSide } from "./area-tools";
import { EntitySystem } from "./entity/EntitySystem";

export enum JoinAreaSide {
  LEFT = 1,
  TOP = 2,
  RIGHT = 3,
  BOTTOM = 4,
}

export class Area {
  private lastUpdateTs = Date.now();

  private readonly users = new Set<string>();

  constructor(
    readonly x: number,
    readonly y: number,
    readonly floor: Floor,
    readonly objects: Objects,
    readonly air: Air,
    readonly npcSpawnPoints: NpcSpawnPoints,
    readonly entities: EntitySystem,
    readonly surroundingAreas: SurroundingAreas,
  ) {
  }

  update(lib: Lib, id: string) {
    const now = Date.now();
    const motionScaleFactor = calcMotionScaleFactor(now - this.lastUpdateTs);
    this.lastUpdateTs = now;

    this.entities.movables.iterate((id, movable) => {
      movable.movable.update(motionScaleFactor, this.objects.currentCollisionModel);
    });

    this.entities.movableAttackers.iterate((id, movableAttacker) => {
      movableAttacker.update(id, this, lib.user);
    });

    this.cleanupEntities(now, lib.user);

    this.npcSpawnPoints.update(this, lib.tools, lib.user);

    const result = this.surroundingAreas.checkPlayerOnLeaveTile(this.entities);
    if (result) {
      this.removeUser(result.userId, id, lib.user, lib.log);
      startJoinArea(lib.entityFunc, result.userId, this.areaIdForSide(result.side), oppositeOfSide(result.side));
    }
  }

  private areaIdForSide(side: JoinAreaSide): string {
    switch (side) {
      case JoinAreaSide.LEFT:
        return areaId(this.x - 1, this.y);
      case JoinAreaSide.TOP:
      default:
        return areaId(this.x, this.y - 1);
      case JoinAreaSide.RIGHT:
        return areaId(this.x + 1, this.y);
      case JoinAreaSide.BOTTOM:
        return areaId(this.x, this.y + 1);
    }
  }

  private cleanupEntities(now: number, userFunctions: UserFunctions) {
    const entitiesToRemove: string[] = [];
    this.entities.attackables.iterate((id, attackable) => {
      if (!attackable.isAlive && now - attackable.diedAtTimestamp > CORPSE_TIMEOUT_MS) {
        entitiesToRemove.push(id);
      }
    });

    for (const id of entitiesToRemove) {
      this.removeEntity(id, userFunctions);
    }
  }

  hasUser(userId: string): boolean {
    return this.users.has(userId);
  }

  joinUser(userFunctions: UserFunctions, log: Logger, userId: string, areaId: string, side?: JoinAreaSide): void {
    this.users.add(userId);

    let pos: Vector2D;

    if (side) {
      const surroundingArea = this.surroundingAreas.getForSide(side);
      pos = new Vector2D(surroundingArea.enterTile.x, surroundingArea.enterTile.y);
    }
    else {
      pos = new Vector2D(this.floor.sizeX / 2, this.floor.sizeY / 2);
    }

    this.createEntityFromTemplate(
      userId,
      pos,
      PLAYER_TEMPLATE,
      userFunctions,
      userId,
    );

    const joinArea: JoinAreaDto = {
      uc: UseCaseId.JOIN_AREA,
      area: mapAreaToDto(this),
    };
    userFunctions.send(userId, joinArea);

    log.log(LogLevel.INFO, `User=${userId} joined area=${areaId}`);
  }

  removeUser(userId: string, areaId: string, userFunctions: UserFunctions, log: Logger): void {
    this.users.delete(userId);
    this.removeEntity(userId, userFunctions, userId);

    log.log(LogLevel.INFO, `User=${userId} left area=${areaId}`);
  }

  removeEntity(id: string, userFunctions: UserFunctions, sendToAllExceptUserId?: string): void {
    this.entities.removeEntity(id);

    const despawnEntity: DespawnEntityDto = {
      uc: UseCaseId.DESPAWN_ENTITY,
      id,
    };
    this.sendToAllExcept(userFunctions, despawnEntity, sendToAllExceptUserId || null);
  }

  createEntityFromTemplate(
    entityId: string,
    pos: Vector2D,
    template: EntityTemplate,
    userFunctions: UserFunctions,
    exceptUserId: string | null,
  ): string {
    this.entities.createEntityFromTemplate(entityId, pos, template);

    const spawnEntity: SpawnEntityDto = {
      uc: UseCaseId.SPAWN_ENTITY,
      entity: entityToDto(entityId, this.entities),
    };
    this.sendToAllExcept(userFunctions, spawnEntity, exceptUserId);

    return entityId;
  }

  sendToAllExcept(userFunctions: UserFunctions, payload: JsonObject, exceptUserId: string | null): void {
    for (const userId of this.users) {
      if (exceptUserId && userId === exceptUserId) {
        continue;
      }

      userFunctions.send(userId, payload);
    }
  }
}
