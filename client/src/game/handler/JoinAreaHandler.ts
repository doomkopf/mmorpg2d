import { EngineAppContext } from "../../engine/Engine"
import { mapDtoToArea } from "../area-mapping"
import { createEntityFromDto } from "../entity-mapping"
import { GameEntitySystem } from "../entity/GameEntitySystem"
import { GameContext } from "../GameContext"
import { Json } from "../server/arcturus-client/arcturus-client"
import { MessageHandler } from "../server/arcturus-client/arcturus-session"
import { JoinAreaDto } from "../shared/dto"

export class JoinAreaHandler implements MessageHandler {
  constructor(
    private readonly ctx: EngineAppContext,
    private readonly gameCtx: GameContext,
  ) {
  }

  handle(json: Json): void {
    if (!this.gameCtx.userId) {
      console.error("joinArea before having a userId")
      return
    }

    const joinAreaDto = json as JoinAreaDto
    const areaDto = joinAreaDto.area

    const area = mapDtoToArea(areaDto, new GameEntitySystem(), this.gameCtx.entityTemplates)

    for (const entityDto of areaDto.entities) {
      createEntityFromDto(area.engineArea.entities, area.entities, entityDto)
    }

    area.engineArea.attachCameraToVisible(this.gameCtx.userId)

    this.gameCtx.area = area
    this.ctx.area = area.engineArea
  }
}
