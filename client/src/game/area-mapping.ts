import { AnimatedTile } from "../engine/AnimatedTile"
import { Area } from "../engine/Area"
import { ExtraEffect } from "../engine/ExtraEffect"
import { MultiImageTile } from "../engine/MultiImageTile"
import { Vector2D } from "../engine/shared/geom/Vector2D"
import { TileCoord } from "../engine/shared/TileCoord"
import { SingleImageTile } from "../engine/SingleImageTile"
import { TileObject } from "../engine/TileObject"
import { GameEntitySystem } from "./entity/GameEntitySystem"
import { GameArea } from "./GameArea"
import { AnimatedTileDto, AreaDto, NpcSpawnPointDto, PortalDto, TileObjectDto } from "./shared/dto"
import { EntityTemplates } from "./shared/entity/template/entity-template"

export function mapDtoToArea(areaDto: AreaDto, gameEntities: GameEntitySystem, entityTemplates: EntityTemplates): GameArea {
    return new GameArea(
        new Area(
            areaDto.floor,
            mapDtoToTileObjects(areaDto.objects),
            areaDto.air,
            [],
            new Vector2D(0, 0),
        ),
        gameEntities,
        areaDto.portals,
        areaDto.npcSpawnPoints,
        entityTemplates,
    )
}

function mapDtoToAnimatedTile(dto: AnimatedTileDto): AnimatedTile {
    if (dto.length === 1) {
        return new SingleImageTile(dto[0])
    }

    return new MultiImageTile(dto)
}

function mapDtoToTileObjects(dtos: (TileObjectDto | null)[][]): (TileObject | null)[][] {
    const tileObjects: (TileObject | null)[][] = []
    for (let y = 0; y < dtos.length; y++) {
        const objectLineDto = dtos[y]
        const objectLine: (TileObject | null)[] = []
        tileObjects[y] = objectLine
        for (let x = 0; x < objectLineDto.length; x++) {
            objectLine[x] = mapDtoToTileObject(objectLineDto[x])
        }
    }

    return tileObjects
}

export function mapDtoToTileObject(dto: TileObjectDto | null): TileObject | null {
    return dto ? new TileObject(mapDtoToAnimatedTile(dto.anim), dto.w) : null
}

export function mapPortalsDtoToExtraEffects(portals: PortalDto[]): ExtraEffect[] {
    const extraEffects: ExtraEffect[] = []

    for (const dto of portals) {
        extraEffects.push(new ExtraEffect(new Vector2D(dto.leaveTile.x, dto.leaveTile.y), null, {
            r: 0,
            g: 200,
            b: 0,
            a: 0,
        }))
        extraEffects.push(new ExtraEffect(new Vector2D(dto.enterTile.x, dto.enterTile.y), null, {
            r: 200,
            g: 0,
            b: 0,
            a: 0,
        }))
    }

    return extraEffects
}

export function mapNpcSpawnPointsToExtraEffects(npcSpawnPoints: NpcSpawnPointDto[], entityTemplates: EntityTemplates): ExtraEffect[] {
    const extraEffects: ExtraEffect[] = []

    for (const sp of npcSpawnPoints) {
        extraEffects.push(new ExtraEffect(new Vector2D(sp.pos.x, sp.pos.y), entityTemplates.templates[sp.templateId].name, {
            r: 0,
            g: 0,
            b: 200,
            a: 0,
        }))
    }

    return extraEffects
}

export function mapDrawPointToExtraEffect(p: TileCoord): ExtraEffect {
    return new ExtraEffect(p.toAreaCoords(), null, { r: 100, g: 0, b: 0, a: 0 })
}
