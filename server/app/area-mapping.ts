import { entityToDto } from "./entity-mapping"
import { Area } from "./entity/area/Area"
import { EntitySystem } from "./entity/area/entity/EntitySystem"
import { NpcSpawnPoint } from "./entity/area/NpcSpawnPoint"
import { NpcSpawnPoints } from "./entity/area/NpcSpawnPoints"
import { SurroundingArea, SurroundingAreas } from "./entity/area/SurroundingAreas"
import { TileObject } from "./entity/area/TileObject"
import { AreaDto, EntityDto, NpcSpawnPointDto, PortalDto, TileObjectDto } from "./game-shared/dto"

export function mapAreaToDto(area: Area): AreaDto {
    return {
        floor: area.floor.readonlyArray,
        objects: area.objects.readonlyArray.map(line => line.map(mapTileObjectToDto)),
        air: area.air.readonlyArray,
        entities: mapEntitiesToDto(area.entities),
        portals: mapSurroundingAreasToPortalsDto(area.surroundingAreas),
        npcSpawnPoints: mapNpcSpawnPointsToDto(area.npcSpawnPoints),
    }
}

function mapEntitiesToDto(entities: EntitySystem): EntityDto[] {
    const dtos: EntityDto[] = []

    entities.positionables.iterate((id) => {
        const entity = entityToDto(id, entities)
        dtos.push(entity)
    })

    return dtos
}

export function mapTileObjectToDto(to: TileObject | null): TileObjectDto | null {
    if (!to) {
        return null
    }

    return {
        anim: to.anim.readonlyImageIds,
        w: to.isWalkable,
    }
}

function mapSurroundingAreasToPortalsDto(surroundingAreas: SurroundingAreas): PortalDto[] {
    return [
        mapSurroundingAreaToPortalDto(surroundingAreas.leftArea),
        mapSurroundingAreaToPortalDto(surroundingAreas.topArea),
        mapSurroundingAreaToPortalDto(surroundingAreas.rightArea),
        mapSurroundingAreaToPortalDto(surroundingAreas.bottomArea),
    ]
}

function mapSurroundingAreaToPortalDto(surroundingArea: SurroundingArea): PortalDto {
    return {
        leaveTile: surroundingArea.leaveTile,
        enterTile: surroundingArea.enterTile,
    }
}

export function mapNpcSpawnPointsToDto(spawnPoints: NpcSpawnPoints): NpcSpawnPointDto[] {
    const list: NpcSpawnPointDto[] = []

    spawnPoints.iterate((id, sp) => {
        list.push(mapNpcSpawnPointToDto(id, sp))
    })

    return list
}

function mapNpcSpawnPointToDto(id: string, spawnPoint: NpcSpawnPoint): NpcSpawnPointDto {
    return {
        id,
        templateId: spawnPoint.templateId,
        pos: spawnPoint.pos,
    }
}
