import { EntityId } from "../../../tmp-api/core";
import { Lib } from "../../../tmp-api/lib";
import { DEFAULT_AREA_HEIGHT, DEFAULT_AREA_WIDTH } from "../../contants";
import { Air } from "./Air";
import { Area } from "./Area";
import { Floor } from "./Floor";
import { NpcSpawnPoints } from "./NpcSpawnPoints";
import { Objects } from "./Objects";
import { SurroundingAreas } from "./SurroundingAreas";
import { TileObject } from "./TileObject";
import { areaCoordsFromId } from "./area-tools";
import { createEmptyEntitySystem } from "./entity/EntitySystem";

export function createDefaultArea(id: EntityId): Area {
  const floor: string[][] = [];
  for (let y = 0; y < DEFAULT_AREA_HEIGHT; y++) {
    const line: string[] = [];
    floor.push(line);
    for (let x = 0; x < DEFAULT_AREA_WIDTH; x++) {
      line.push("");
    }
  }

  const objects: (TileObject | null)[][] = [];
  for (let y = 0; y < DEFAULT_AREA_HEIGHT; y++) {
    const line: (TileObject | null)[] = [];
    objects.push(line);
    for (let x = 0; x < DEFAULT_AREA_WIDTH; x++) {
      line.push(null);
    }
  }

  const air: (string | null)[][] = [];
  for (let y = 0; y < DEFAULT_AREA_HEIGHT; y++) {
    const line: (string | null)[] = [];
    air.push(line);
    for (let x = 0; x < DEFAULT_AREA_WIDTH; x++) {
      line.push(null);
    }
  }

  const areaCoords = areaCoordsFromId(id);

  return new Area(
    areaCoords.x, areaCoords.y,
    new Floor(floor),
    new Objects(objects),
    new Air(air),
    new NpcSpawnPoints({}),
    createEmptyEntitySystem(),
    new SurroundingAreas(),
  );
}

export const areaInterval = (area: Area, id: EntityId, lib: Lib) => {
  area.update(lib, id);
};
