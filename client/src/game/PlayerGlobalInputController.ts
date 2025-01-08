import { EngineAppContext, GlobalInputListener } from "../engine/Engine"
import { GlobalInputDispatcher } from "../engine/GlobalInputDispatcher"
import { Vector2D } from "../engine/shared/geom/Vector2D"
import { SoundManager } from "../engine/SoundManager"
import {
  VECTOR_DOWN,
  VECTOR_DOWN_LEFT,
  VECTOR_DOWN_RIGHT,
  VECTOR_LEFT,
  VECTOR_RIGHT,
  VECTOR_UP,
  VECTOR_UP_LEFT,
  VECTOR_UP_RIGHT,
} from "./constants"
import { GameContext } from "./GameContext"
import { MovePlayerRequest, StopPlayerRequest, UseCaseId } from "./shared/dto"
import { Sounds } from "./sounds"

export class PlayerGlobalInputController implements GlobalInputListener {
  constructor(
    private readonly soundManager: SoundManager,
    private readonly gameCtx: GameContext,
    globalInputDispatcher: GlobalInputDispatcher,
  ) {
    globalInputDispatcher.addListener(this)
  }

  onKeyHit(ctx: EngineAppContext, key: string): void {
    if (this.gameCtx.userId) {
      if (key === "c") {
        this.attack(this.gameCtx.userId)
      }

      if (key === "p") {
        this.soundManager.play(Sounds.TEST, false)
      }
    }
  }

  onKeyDown(ctx: EngineAppContext/*, key: string*/): void {
    this.handlePlayerMovement(ctx)
  }

  onKeyUp(ctx: EngineAppContext/*, key: string*/): void {
    this.handlePlayerMovement(ctx)
  }

  private attack(userId: string) {
    if (this.gameCtx.area?.entities.humanoidAnimations.get(userId).attack(Date.now())) {
      this.gameCtx.server.send(UseCaseId.ATTACK, "", "", {})
    }
  }

  private handlePlayerMovement(ctx: EngineAppContext) {
    const rightDown = this.isRightDown(ctx)
    const downDown = this.isDownDown(ctx)
    const leftDown = this.isLeftDown(ctx)
    const upDown = this.isUpDown(ctx)

    if (rightDown) {
      if (downDown) {
        this.playerMove(ctx, VECTOR_DOWN_RIGHT)
        return
      }

      if (upDown) {
        this.playerMove(ctx, VECTOR_UP_RIGHT)
        return
      }

      this.playerMove(ctx, VECTOR_RIGHT)

      return
    }

    if (leftDown) {
      if (downDown) {
        this.playerMove(ctx, VECTOR_DOWN_LEFT)
        return
      }

      if (upDown) {
        this.playerMove(ctx, VECTOR_UP_LEFT)
        return
      }

      this.playerMove(ctx, VECTOR_LEFT)

      return
    }

    if (downDown) {
      this.playerMove(ctx, VECTOR_DOWN)
      return
    }

    if (upDown) {
      this.playerMove(ctx, VECTOR_UP)
      return
    }

    this.playerStop(ctx)
  }

  private playerMove(ctx: EngineAppContext, dir: Vector2D) {
    const { area } = ctx
    if (!area || !this.gameCtx.userId) {
      return
    }

    const anim = this.gameCtx.area?.entities.humanoidAnimations.get(this.gameCtx.userId)
    if (!anim?.isAlive) {
      return
    }

    const playerMov = area.entities.movables.get(this.gameCtx.userId)
    playerMov.moveInDirection(dir)

    const playerPos = area.entities.positionables.get(this.gameCtx.userId)

    const movePlayer: MovePlayerRequest = {
      pos: playerPos,
      dir: playerMov.dir,
    }
    this.gameCtx.server.send(UseCaseId.MOVE_PLAYER, "", "", movePlayer)
  }

  private playerStop(ctx: EngineAppContext) {
    const { area } = ctx
    if (!area || !this.gameCtx.userId) {
      return
    }

    if (area.entities.movables.get(this.gameCtx.userId).stop()) {
      const stopPlayer: StopPlayerRequest = {
        pos: area.entities.positionables.get(this.gameCtx.userId),
      }
      this.gameCtx.server.send(UseCaseId.STOP_PLAYER, "", "", stopPlayer)
    }
  }

  private isRightDown(ctx: EngineAppContext): boolean {
    return ctx.isKeyDown("d") || ctx.isKeyDown("ArrowRight")
  }

  private isDownDown(ctx: EngineAppContext): boolean {
    return ctx.isKeyDown("s") || ctx.isKeyDown("ArrowDown")
  }

  private isLeftDown(ctx: EngineAppContext): boolean {
    return ctx.isKeyDown("a") || ctx.isKeyDown("ArrowLeft")
  }

  private isUpDown(ctx: EngineAppContext): boolean {
    return ctx.isKeyDown("w") || ctx.isKeyDown("ArrowUp")
  }
}
