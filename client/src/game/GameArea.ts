import { Area } from "../engine/Area"
import { ExtraEffect } from "../engine/ExtraEffect"
import { TileCoord } from "../engine/shared/TileCoord"
import {
  mapDrawPointToExtraEffect,
  mapNpcSpawnPointsToExtraEffects,
  mapPortalsDtoToExtraEffects,
} from "./area-mapping"
import { GameEntitySystem } from "./entity/GameEntitySystem"
import { NpcSpawnPointDto, PortalDto } from "./shared/dto"
import { EntityTemplates } from "./shared/entity/template/entity-template"

export class GameArea {
  private isShowNpcSpawnPoints = false

  private drawPoint1: TileCoord | null = null

  constructor(
    readonly engineArea: Area,
    readonly entities: GameEntitySystem,
    readonly portals: PortalDto[],
    private npcSpawnPoints: NpcSpawnPointDto[],
    private entityTemplates: EntityTemplates,
  ) {
    this.replaceEngineExtraEffects()
  }

  removeEntity(id: string): void {
    this.entities.removeEntity(id)
    this.engineArea.entities.removeEntity(id)
  }

  get readonlyNpcSpawnPoints(): NpcSpawnPointDto[] {
    return this.npcSpawnPoints
  }

  replaceNpcSpawnPoints(npcSpawnPoints: NpcSpawnPointDto[]): void {
    this.npcSpawnPoints = npcSpawnPoints
    this.replaceEngineExtraEffects()
  }

  toggleNpcSpawnPoints(): void {
    this.isShowNpcSpawnPoints = !this.isShowNpcSpawnPoints
    this.replaceEngineExtraEffects()
  }

  addDrawPoint(x: number, y: number): TileCoord[] | null {
    const tile = TileCoord.fromAreaCoords(x, y)

    if (!this.drawPoint1) {
      this.drawPoint1 = tile
      this.replaceEngineExtraEffects()
      return null
    }

    if (this.drawPoint1.x.value > tile.x.value) {
      const tmp = tile.x.value
      tile.x.value = this.drawPoint1.x.value
      this.drawPoint1.x.value = tmp
    }

    if (this.drawPoint1.y.value > tile.y.value) {
      const tmp = tile.y.value
      tile.y.value = this.drawPoint1.y.value
      this.drawPoint1.y.value = tmp
    }

    const points = [this.drawPoint1, tile]

    this.drawPoint1 = null
    this.replaceEngineExtraEffects()

    return points
  }

  private replaceEngineExtraEffects() {
    let extraEffects: ExtraEffect[]

    extraEffects = mapPortalsDtoToExtraEffects(this.portals)
    if (this.isShowNpcSpawnPoints) {
      extraEffects = extraEffects.concat(mapNpcSpawnPointsToExtraEffects(this.npcSpawnPoints, this.entityTemplates))
    }

    if (this.drawPoint1) {
      extraEffects.push(mapDrawPointToExtraEffect(this.drawPoint1))
    }

    this.engineArea.replaceExtraEffects(extraEffects)
  }
}
