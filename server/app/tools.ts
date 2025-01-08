import { MAX_POSITION_DEVIATION } from "./contants";
import { roughlyEquals } from "./engine-shared/geom/math";
import { Vector2D } from "./engine-shared/geom/Vector2D";
import { ENTITY_TEMPLATES } from "./game-data/entity-templates";
import { Vector2DDto } from "./game-shared/dto";
import { EntityTemplate } from "./game-shared/entity/template/entity-template";

/**
 * @returns true if client pos was applied
 */
export function applyClientPosIfAcceptable(pos: Vector2D, posDto: Vector2DDto): boolean {
  if (roughlyEquals(pos.x, posDto.x, MAX_POSITION_DEVIATION)
    && roughlyEquals(pos.y, posDto.y, MAX_POSITION_DEVIATION)) {
    pos.x = posDto.x;
    pos.y = posDto.y;

    return true;
  }

  return false;
}

export function getEntityTemplate(id: string): EntityTemplate | null {
  const template = ENTITY_TEMPLATES.templates[id];
  return template?.template || null;
}
