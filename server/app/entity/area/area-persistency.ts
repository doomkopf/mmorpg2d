import { DeserializeEntity, SerializeEntity } from "gammaray-app/core";
import { Vector2D } from "../../engine-shared/geom/Vector2D";
import { ENTITY_TEMPLATES } from "../../game-data/entity-templates";
import { Air } from "./Air";
import { AnimatedTile } from "./AnimatedTile";
import { Area } from "./Area";
import { Floor } from "./Floor";
import { NpcSpawnPoint } from "./NpcSpawnPoint";
import { NpcSpawnPoints } from "./NpcSpawnPoints";
import { Objects } from "./Objects";
import { SurroundingAreas } from "./SurroundingAreas";
import { TileObject } from "./TileObject";
import { areaCoordsFromId } from "./area-tools";
import { createEmptyEntitySystem } from "./entity/EntitySystem";

interface Vector2DEntity {
  x: number;
  y: number;
}

export type AnimatedTileEntity = (string | null)[];

interface TileObjectEntity {
  anim: AnimatedTileEntity;
  isWalkable: boolean;
}

interface NpcSpawnPointEntity {
  templateId: string;
  pos: Vector2DEntity;
}

type NpcSpawnPointsEntity = { [id: string]: NpcSpawnPointEntity };

interface AreaEntity {
  floor: string[][];
  objects: (TileObjectEntity | null)[][];
  air: (string | null)[][];
  npcSpawnPoints: NpcSpawnPointsEntity;
}

// MAP TO ENTITY

function mapNpcSpawnPointsToEntity(domain: NpcSpawnPoints): NpcSpawnPointsEntity {
  const entity: NpcSpawnPointsEntity = {};

  domain.iterate((id, sp) => {
    entity[id] = {
      pos: sp.pos,
      templateId: sp.templateId,
    };
  });

  return entity;
}

function mapTileObjectsToEntity(domain: (TileObject | null)[][]): (TileObjectEntity | null)[][] {
  const entity: (TileObjectEntity | null)[][] = [];

  for (let y = 0; y < domain.length; y++) {
    const domainLine = domain[y];
    const entityLine: (TileObjectEntity | null)[] = [];
    entity.push(entityLine);
    for (let x = 0; x < domainLine.length; x++) {
      const entity = domainLine[x];
      entityLine.push(entity ? mapTileObjectToEntity(entity) : null);
    }
  }

  return entity;
}

function mapTileObjectToEntity(domain: TileObject): TileObjectEntity {
  return { anim: domain.anim.readonlyImageIds, isWalkable: domain.isWalkable };
}

export const areaSerializeEntity: SerializeEntity<Area> = (id, area): AreaEntity => {
  return {
    floor: area.floor.readonlyArray,
    objects: mapTileObjectsToEntity(area.objects.readonlyArray),
    air: area.air.readonlyArray,
    npcSpawnPoints: mapNpcSpawnPointsToEntity(area.npcSpawnPoints),
  };
};

// MAP TO DOMAIN

function mapNpcSpawnPointsToDomain(entity: NpcSpawnPointsEntity): NpcSpawnPoints {
  const map: { [id: string]: NpcSpawnPoint } = {};

  for (const id in entity) {
    const sp = entity[id];
    map[id] = new NpcSpawnPoint(sp.templateId, ENTITY_TEMPLATES.templates[sp.templateId].template, new Vector2D(sp.pos.x, sp.pos.y));
  }

  return new NpcSpawnPoints(map);
}

function mapTileObjectsToDomain(entity: (TileObjectEntity | null)[][]): (TileObject | null)[][] {
  const domain: (TileObject | null)[][] = [];

  for (let y = 0; y < entity.length; y++) {
    const entityLine = entity[y];
    const domainLine: (TileObject | null)[] = [];
    domain.push(domainLine);
    for (let x = 0; x < entityLine.length; x++) {
      const obj = entityLine[x];
      domainLine.push(obj ? new TileObject(new AnimatedTile(obj.anim), obj.isWalkable) : null);
    }
  }

  return domain;
}

export const areaDeserializeEntity: DeserializeEntity<Area> = (id, db) => {
  const areaCoords = areaCoordsFromId(id);

  const area = db as AreaEntity;

  return new Area(
    areaCoords.x, areaCoords.y,
    new Floor(area.floor),
    new Objects(mapTileObjectsToDomain(area.objects)),
    new Air(area.air),
    mapNpcSpawnPointsToDomain(area.npcSpawnPoints),
    createEmptyEntitySystem(),
    new SurroundingAreas(),
  );
};
