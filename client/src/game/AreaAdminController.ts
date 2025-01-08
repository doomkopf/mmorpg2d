import { AreaInputDispatcher } from "../engine/AreaInputDispatcher"
import { AreaInputListener, EngineAppContext } from "../engine/Engine"
import { HALF_TILE_SIZE_IN_COORDS } from "../engine/shared/constants"
import { Vector2D } from "../engine/shared/geom/Vector2D"
import { TileCoord } from "../engine/shared/TileCoord"
import { GameContext } from "./GameContext"
import {
  DrawAirRequest,
  DrawFloorRequest,
  DrawTileObjectsRequest,
  PlaceEntityRequest,
  PlaceNpcSpawnPointRequest,
  RemoveNpcSpawnPointRequest,
  UseCaseId,
} from "./shared/dto"

export class AreaAdminController implements AreaInputListener {
  constructor(
    private readonly gameCtx: GameContext,
    areaInputDispatcher: AreaInputDispatcher,
  ) {
    areaInputDispatcher.addListener(this)
  }

  onClick(ctx: EngineAppContext, x: number, y: number): void {
    const { area } = this.gameCtx
    if (!area) {
      return
    }

    // floor
    if (ctx.isKeyDown("f")) {
      const points = area.addDrawPoint(x, y)
      if (points) {
        this.placeSelectedFloor(points[0], points[1])
      }
    }
    // tileobjects
    else if (ctx.isKeyDown("g")) {
      const points = area.addDrawPoint(x, y)
      if (points) {
        if (ctx.isKeyDown("Alt")) {
          this.removeTileObjects(points[0], points[1])
        }
        else {
          this.placeSelectedTileObjects(points[0], points[1], ctx.isKeyDown("-"), ctx.isKeyDown("+"))
        }
      }
    }
    // air
    else if (ctx.isKeyDown("h")) {
      const points = area.addDrawPoint(x, y)
      if (points) {
        if (ctx.isKeyDown("Alt")) {
          this.removeAir(points[0], points[1])
        }
        else {
          this.placeSelectedAir(points[0], points[1])
        }
      }
    }
    // npc spawnpoints
    else if (ctx.isKeyDown("j")) {
      if (ctx.isKeyDown("Alt")) {
        this.removeNpcSpawnPoint(x, y)
      }
      else {
        this.placeSelectedTemplateAsNpcSpawnPoint(x, y)
      }
    }
  }

  private placeSelectedFloor(min: TileCoord, max: TileCoord) {
    const selection = this.gameCtx.imageSelectionGrid
    if (!selection || !selection.selectedItem) {
      return
    }

    const drawFloor: DrawFloorRequest = {
      id: selection.selectedItem.id,
      min: { x: min.x.value, y: min.y.value },
      max: { x: max.x.value, y: max.y.value },
    }
    this.gameCtx.server.send(UseCaseId.DRAW_FLOOR, "", "", drawFloor)
  }

  private placeSelectedTileObjects(min: TileCoord, max: TileCoord, walkable: boolean, stackAnim: boolean) {
    const selection = this.gameCtx.imageSelectionGrid
    if (!selection || !selection.selectedItem) {
      return
    }

    const drawTileObjects: DrawTileObjectsRequest = {
      id: selection.selectedItem.id,
      w: walkable,
      stackAnim,
      min: { x: min.x.value, y: min.y.value },
      max: { x: max.x.value, y: max.y.value },
    }
    this.gameCtx.server.send(UseCaseId.DRAW_TILE_OBJECTS, "", "", drawTileObjects)
  }

  private placeSelectedAir(min: TileCoord, max: TileCoord) {
    const selection = this.gameCtx.imageSelectionGrid
    if (!selection || !selection.selectedItem) {
      return
    }

    const drawAir: DrawAirRequest = {
      id: selection.selectedItem.id,
      min: { x: min.x.value, y: min.y.value },
      max: { x: max.x.value, y: max.y.value },
    }
    this.gameCtx.server.send(UseCaseId.DRAW_AIR, "", "", drawAir)
  }

  private removeTileObjects(min: TileCoord, max: TileCoord) {
    const drawTileObjects: DrawTileObjectsRequest = {
      id: null,
      w: false,
      stackAnim: false,
      min: { x: min.x.value, y: min.y.value },
      max: { x: max.x.value, y: max.y.value },
    }
    this.gameCtx.server.send(UseCaseId.DRAW_TILE_OBJECTS, "", "", drawTileObjects)
  }

  private removeAir(min: TileCoord, max: TileCoord) {
    const drawAir: DrawAirRequest = {
      min: { x: min.x.value, y: min.y.value },
      max: { x: max.x.value, y: max.y.value },
    }
    this.gameCtx.server.send(UseCaseId.DRAW_AIR, "", "", drawAir)
  }

  onDoubleClick(ctx: EngineAppContext, x: number, y: number): void {
    this.placeSelectedEntityTemplate(x, y)
  }

  private placeSelectedEntityTemplate(x: number, y: number) {
    const selection = this.gameCtx.entityTemplateSelectionGrid
    if (!selection || !selection.selectedItem) {
      return
    }

    const placeEntity: PlaceEntityRequest = {
      templateId: selection.selectedItem.id,
      pos: { x, y },
    }
    this.gameCtx.server.send(UseCaseId.PLACE_ENTITY, "", "", placeEntity)
  }

  private async placeSelectedTemplateAsNpcSpawnPoint(x: number, y: number) {
    const selection = this.gameCtx.entityTemplateSelectionGrid
    if (!selection || !selection.selectedItem) {
      return
    }

    const placeNpcSpawnPoint: PlaceNpcSpawnPointRequest = {
      pos: { x, y },
      templateId: selection.selectedItem.id,
    }
    this.gameCtx.server.request(UseCaseId.PLACE_NPC_SPAWN_POINT, "", "", placeNpcSpawnPoint)
  }

  private async removeNpcSpawnPoint(x: number, y: number) {
    const { area } = this.gameCtx
    if (!area) {
      return
    }

    const p1 = new Vector2D(x, y)

    for (const sp of area.readonlyNpcSpawnPoints) {
      const p2 = new Vector2D(sp.pos.x, sp.pos.y)
      if (p1.distanceTo(p2) < HALF_TILE_SIZE_IN_COORDS) {
        const removeNpcSpawnPoint: RemoveNpcSpawnPointRequest = {
          id: sp.id,
        }
        this.gameCtx.server.request(UseCaseId.REMOVE_NPC_SPAWN_POINT, "", "", removeNpcSpawnPoint)
        break
      }
    }
  }
}
