import { JsonObject } from "../../../tmp-api/core"
import { Lib } from "../../../tmp-api/lib"
import { Logger, LogLevel } from "../../../tmp-api/log"
import { UserFunctions } from "../../../tmp-api/user"
import { mapAreaToDto } from "../../area-mapping"
import { CORPSE_TIMEOUT_MS } from "../../contants"
import { Vector2D } from "../../engine-shared/geom/Vector2D"
import { calcMotionScaleFactor } from "../../engine-shared/tools"
import { entityToDto } from "../../entity-mapping"
import { PLAYER_TEMPLATE } from "../../game-data/entity-templates"
import { DespawnEntityDto, JoinAreaDto, SpawnEntityDto, UseCaseId } from "../../game-shared/dto"
import { EntityTemplate } from "../../game-shared/entity/template/entity-template"
import { startJoinArea } from "../../usecase/internal/join-area"
import { Air } from "./Air"
import { areaCoordsFromId, areaId, oppositeOfSide } from "./area-tools"
import { createEmptyEntitySystem, EntitySystem } from "./entity/EntitySystem"
import { Floor } from "./Floor"
import { NpcSpawnPoints } from "./NpcSpawnPoints"
import { Objects } from "./Objects"
import { SurroundingAreas } from "./SurroundingAreas"

export enum JoinAreaSide {
    LEFT = 1,
    TOP = 2,
    RIGHT = 3,
    BOTTOM = 4,
}

export class Area {
    constructor(
        readonly floor: Floor,
        readonly objects: Objects,
        readonly air: Air,
        readonly npcSpawnPoints: NpcSpawnPoints,
        readonly entities: EntitySystem,
        readonly surroundingAreas: SurroundingAreas,
        private readonly users: string[],
        private lastUpdateTs: number,
    ) {
    }

    static fromObject(obj: JsonObject): Area {
        return new Area(
            Floor.fromObject(obj.floor),
            Objects.fromObject(obj.objects),
            Air.fromObject(obj.air),
            NpcSpawnPoints.fromObject(obj.npcSpawnPoints),
            obj.entities ? EntitySystem.fromObject(obj.entities) : createEmptyEntitySystem(),
            new SurroundingAreas(),
            obj.users,
            obj.lastUpdateTs ? obj.lastUpdateTs : 0,
        )
    }

    update(lib: Lib, id: string) {
        const now = Date.now()
        const motionScaleFactor = calcMotionScaleFactor(now - this.lastUpdateTs)
        this.lastUpdateTs = now

        this.entities.movables.iterate((id, movable) => {
            movable.movable.update(motionScaleFactor, this.objects.currentCollisionModel)
        })

        this.entities.movableAttackers.iterate((id, movableAttacker) => {
            movableAttacker.update(id, this, lib.user)
        })

        this.cleanupEntities(now, lib.user)

        this.npcSpawnPoints.update(this, lib.tools, lib.user)

        const result = this.surroundingAreas.checkPlayerOnLeaveTile(this.entities)
        if (result) {
            this.removeUser(result.userId, id, lib.user, lib.log)
            startJoinArea(lib.entityFunc, result.userId, this.areaIdForSide(result.side, id), oppositeOfSide(result.side))
        }
    }

    private areaIdForSide(side: JoinAreaSide, id: string): string {
        const areaCoords = areaCoordsFromId(id)
        switch (side) {
            case JoinAreaSide.LEFT:
                return areaId(areaCoords.x - 1, areaCoords.y)
            case JoinAreaSide.TOP:
            default:
                return areaId(areaCoords.x, areaCoords.y - 1)
            case JoinAreaSide.RIGHT:
                return areaId(areaCoords.x + 1, areaCoords.y)
            case JoinAreaSide.BOTTOM:
                return areaId(areaCoords.x, areaCoords.y + 1)
        }
    }

    private cleanupEntities(now: number, userFunctions: UserFunctions) {
        const entitiesToRemove: string[] = []
        this.entities.attackables.iterate((id, attackable) => {
            if (!attackable.isAlive && now - attackable.diedAtTimestamp > CORPSE_TIMEOUT_MS) {
                entitiesToRemove.push(id)
            }
        })

        for (const id of entitiesToRemove) {
            this.removeEntity(id, userFunctions)
        }
    }

    hasUser(userId: string): boolean {
        return this.users.indexOf(userId) !== -1
    }

    joinUser(userFunctions: UserFunctions, log: Logger, userId: string, areaId: string, side?: JoinAreaSide): void {
        if (!this.hasUser(userId)) {
            this.users.push(userId)
        }

        let pos: Vector2D

        if (side) {
            const surroundingArea = this.surroundingAreas.getForSide(side)
            pos = new Vector2D(surroundingArea.enterTile.x, surroundingArea.enterTile.y)
        } else {
            pos = new Vector2D(this.floor.sizeX / 2, this.floor.sizeY / 2)
        }

        this.createEntityFromTemplate(
            userId,
            pos,
            PLAYER_TEMPLATE,
            userFunctions,
            userId,
        )

        const joinArea: JoinAreaDto = {
            uc: UseCaseId.JOIN_AREA,
            area: mapAreaToDto(this),
        }
        userFunctions.send(userId, joinArea)

        log.log(LogLevel.INFO, `User=${userId} joined area=${areaId}`)
    }

    removeUser(userId: string, areaId: string, userFunctions: UserFunctions, log: Logger): void {
        this.users.splice(this.users.indexOf(userId), 1)
        this.removeEntity(userId, userFunctions, userId)

        log.log(LogLevel.INFO, `User=${userId} left area=${areaId}`)
    }

    removeEntity(id: string, userFunctions: UserFunctions, sendToAllExceptUserId?: string): void {
        this.entities.removeEntity(id)

        const despawnEntity: DespawnEntityDto = {
            uc: UseCaseId.DESPAWN_ENTITY,
            id,
        }
        this.sendToAllExcept(userFunctions, despawnEntity, sendToAllExceptUserId || null)
    }

    createEntityFromTemplate(
        entityId: string,
        pos: Vector2D,
        template: EntityTemplate,
        userFunctions: UserFunctions,
        exceptUserId: string | null,
    ): string {
        this.entities.createEntityFromTemplate(entityId, pos, template)

        const spawnEntity: SpawnEntityDto = {
            uc: UseCaseId.SPAWN_ENTITY,
            entity: entityToDto(entityId, this.entities),
        }
        this.sendToAllExcept(userFunctions, spawnEntity, exceptUserId)

        return entityId
    }

    sendToAllExcept(userFunctions: UserFunctions, payload: JsonObject, exceptUserId: string | null): void {
        for (const userId of this.users) {
            if (exceptUserId && userId === exceptUserId) {
                continue
            }

            userFunctions.send(userId, payload)
        }
    }
}
