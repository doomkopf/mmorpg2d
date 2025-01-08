import { AreaInputDispatcher } from "../engine/AreaInputDispatcher"
import { EngineAppContext, EngineAppInitResult } from "../engine/Engine"
import { GlobalInputDispatcher } from "../engine/GlobalInputDispatcher"
import { AdminGlobalInputController } from "./AdminGlobalInputController"
import { AreaAdminController } from "./AreaAdminController"
import { GameContext } from "./GameContext"
import { DespawnEntityHandler } from "./handler/DespawnEntityHandler"
import { EntityAttackedHandler } from "./handler/EntityAttackedHandler"
import { EntityDiedHandler } from "./handler/EntityDiedHandler"
import { JoinAreaHandler } from "./handler/JoinAreaHandler"
import { JoinGameHandler } from "./handler/JoinGameHandler"
import { SpawnEntityHandler } from "./handler/SpawnEntityHandler"
import { UpdateAirHandler } from "./handler/UpdateAirHandler"
import { UpdateEntitiesHandler } from "./handler/UpdateEntitiesHandler"
import { UpdateFloorHandler } from "./handler/UpdateFloorHandler"
import { UpdateNpcSpawnPointsHandler } from "./handler/UpdateNpcSpawnPointsHandler"
import { UpdateTileObjectsHandler } from "./handler/UpdateTileObjectsHandler"
import { PlayerGlobalInputController } from "./PlayerGlobalInputController"
import { UseCaseId } from "./shared/dto"
import { SOUNDS } from "./sounds"

export async function init(
  ctx: EngineAppContext,
  globalInputDispatcher: GlobalInputDispatcher,
  areaInputDispatcher: AreaInputDispatcher,
): Promise<EngineAppInitResult> {
  ctx.soundManager.initSounds(SOUNDS)

  const gameCtx = new GameContext()

  gameCtx.server.addMessageHandler(UseCaseId.JOIN_GAME, new JoinGameHandler(ctx, gameCtx))
  gameCtx.server.addMessageHandler(UseCaseId.JOIN_AREA, new JoinAreaHandler(ctx, gameCtx))
  gameCtx.server.addMessageHandler(UseCaseId.SPAWN_ENTITY, new SpawnEntityHandler(gameCtx))
  gameCtx.server.addMessageHandler(UseCaseId.DESPAWN_ENTITY, new DespawnEntityHandler(gameCtx))
  gameCtx.server.addMessageHandler(UseCaseId.UPDATE_ENTITIES, new UpdateEntitiesHandler(gameCtx))
  gameCtx.server.addMessageHandler(UseCaseId.UPDATE_FLOOR, new UpdateFloorHandler(ctx, gameCtx))
  gameCtx.server.addMessageHandler(UseCaseId.UPDATE_TILE_OBJECTS, new UpdateTileObjectsHandler(ctx, gameCtx))
  gameCtx.server.addMessageHandler(UseCaseId.UPDATE_AIR, new UpdateAirHandler(ctx, gameCtx))
  gameCtx.server.addMessageHandler(UseCaseId.ATTACK, new EntityAttackedHandler(gameCtx))
  gameCtx.server.addMessageHandler(UseCaseId.DEATH, new EntityDiedHandler(gameCtx))
  gameCtx.server.addMessageHandler(UseCaseId.UPDATE_NPC_SPAWN_POINTS, new UpdateNpcSpawnPointsHandler(gameCtx))

  gameCtx.server.send(UseCaseId.JOIN_GAME, "", "", {})

  new PlayerGlobalInputController(ctx.soundManager, gameCtx, globalInputDispatcher)
  new AdminGlobalInputController(gameCtx, globalInputDispatcher)
  new AreaAdminController(gameCtx, areaInputDispatcher)

  return {
    updatable: gameCtx,
    imageProvider: gameCtx.imageManager,
  }
}
