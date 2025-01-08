import { DEFAULT_AREA_HEIGHT, DEFAULT_AREA_WIDTH } from "../../contants";
import { HALF_TILE_SIZE_IN_COORDS } from "../../engine-shared/constants";
import { Vector2D } from "../../engine-shared/geom/Vector2D";
import { Faction } from "../../game-shared/entity/template/Faction";
import { JoinAreaSide } from "./Area";
import { EntitySystem } from "./entity/EntitySystem";

export interface SurroundingArea {
  leaveTile: { x: number, y: number };
  enterTile: { x: number, y: number };
}

export class SurroundingAreas {
  readonly leftArea: SurroundingArea;
  readonly topArea: SurroundingArea;
  readonly rightArea: SurroundingArea;
  readonly bottomArea: SurroundingArea;

  constructor() {
    this.leftArea = {
      leaveTile: { x: 1, y: Math.round(DEFAULT_AREA_HEIGHT / 2) },
      enterTile: { x: 2, y: Math.round(DEFAULT_AREA_HEIGHT / 2) },
    };
    this.topArea = {
      leaveTile: { x: Math.round(DEFAULT_AREA_WIDTH / 2), y: 1 },
      enterTile: { x: Math.round(DEFAULT_AREA_WIDTH / 2), y: 2 },
    };
    this.rightArea = {
      leaveTile: { x: DEFAULT_AREA_WIDTH, y: Math.round(DEFAULT_AREA_HEIGHT / 2) },
      enterTile: { x: DEFAULT_AREA_WIDTH - 1, y: Math.round(DEFAULT_AREA_HEIGHT / 2) },
    };
    this.bottomArea = {
      leaveTile: { x: Math.round(DEFAULT_AREA_WIDTH / 2), y: DEFAULT_AREA_HEIGHT },
      enterTile: { x: Math.round(DEFAULT_AREA_WIDTH / 2), y: DEFAULT_AREA_HEIGHT - 1 },
    };
  }

  checkPlayerOnLeaveTile(entities: EntitySystem): { area: SurroundingArea, userId: string, side: JoinAreaSide } | null {
    for (const id of entities.factions.idsIterable) {
      const faction = entities.factions.get(id);
      if (faction === Faction.PLAYER) {
        const pos = entities.positionables.get(id);
        if (SurroundingAreas.isOnTile(pos, this.leftArea)) {
          return { area: this.leftArea, userId: id, side: JoinAreaSide.LEFT };
        }
        if (SurroundingAreas.isOnTile(pos, this.topArea)) {
          return { area: this.topArea, userId: id, side: JoinAreaSide.TOP };
        }
        if (SurroundingAreas.isOnTile(pos, this.rightArea)) {
          return { area: this.rightArea, userId: id, side: JoinAreaSide.RIGHT };
        }
        if (SurroundingAreas.isOnTile(pos, this.bottomArea)) {
          return { area: this.bottomArea, userId: id, side: JoinAreaSide.BOTTOM };
        }
      }
    }

    return null;
  }

  getForSide(side: JoinAreaSide): SurroundingArea {
    switch (side) {
      case JoinAreaSide.LEFT:
        return this.leftArea;
      case JoinAreaSide.TOP:
      default:
        return this.topArea;
      case JoinAreaSide.RIGHT:
        return this.rightArea;
      case JoinAreaSide.BOTTOM:
        return this.bottomArea;
    }
  }

  private static isOnTile(pos: Vector2D, area: SurroundingArea): boolean {
    return area.leaveTile.x - HALF_TILE_SIZE_IN_COORDS < pos.x && pos.x < area.leaveTile.x + HALF_TILE_SIZE_IN_COORDS
      && area.leaveTile.y - HALF_TILE_SIZE_IN_COORDS < pos.y && pos.y < area.leaveTile.y + HALF_TILE_SIZE_IN_COORDS;
  }
}
