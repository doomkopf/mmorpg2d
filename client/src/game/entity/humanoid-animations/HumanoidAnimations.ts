import { Animation } from "../../../engine/Animation"
import { LineFromCenter, ValueBar, Visible } from "../../../engine/entity/Visible"
import { Movable } from "../../../engine/shared/entity/Movable"
import { Vector2D } from "../../../engine/shared/geom/Vector2D"
import { Direction } from "../../Direction"
import { AttackCdValueBar } from "./AttackCdValueBar"
import { AttackTailAnimation } from "./AttackTailAnimation"
import { HpValueBar } from "./HpValueBar"

export class HumanoidAnimations implements Visible {
  private animationDir = Direction.DOWN
  private animationMoving = false

  private currentAnimation: Animation

  private readonly attackTailAnimation: AttackTailAnimation
  private readonly attackCdBar: AttackCdValueBar
  private lastAttackTs = 0

  constructor(
    readonly pos: Vector2D,
    private readonly movable: Movable,
    private readonly animations: {
      readonly downIdle: Animation
      readonly downMove: Animation
      readonly leftIdle: Animation
      readonly leftMove: Animation
      readonly upIdle: Animation
      readonly upMove: Animation
      readonly rightIdle: Animation
      readonly rightMove: Animation
      readonly death: Animation
    },
    readonly hp: HpValueBar | null,
    private readonly attackIntervalMs: number,
    attackRange: number,
  ) {
    this.currentAnimation = animations.downIdle

    this.attackTailAnimation = new AttackTailAnimation(attackRange)
    this.attackCdBar = new AttackCdValueBar(attackIntervalMs)
  }

  get imgId(): string {
    const imgId = this.currentAnimation.currentImageId
    if (!imgId) {
      return ""
    }

    return imgId
  }

  get topValueBar(): ValueBar | undefined {
    return this.hp ? (this.hp.isFull ? undefined : this.hp) : undefined
  }

  get bottomValueBar(): ValueBar | undefined {
    return this.attackCdBar.isFull ? undefined : this.attackCdBar
  }

  attack(now: number): boolean {
    if (this.isAlive && now - this.lastAttackTs >= this.attackIntervalMs) {
      this.lastAttackTs = now
      this.attackTailAnimation.startForDirection(this.determineDirectionOf(this.movable.dir))
      this.attackCdBar.drain()
      return true
    }

    return false
  }

  dead(): void {
    this.currentAnimation = this.animations.death
  }

  get isAlive(): boolean {
    return this.currentAnimation !== this.animations.death
  }

  get lineFromCenter(): LineFromCenter | undefined {
    return this.attackTailAnimation.lineFromCenter
  }

  update(now: number, timeSinceLastIteration: number, motionScaleFactor: number): void {
    this.attackTailAnimation.update(motionScaleFactor)
    this.attackCdBar.update(timeSinceLastIteration)

    if (!this.isAlive) {
      return
    }

    const movableDir = this.determineDirectionOf(this.movable.dir)
    if (movableDir !== this.animationDir || this.animationMoving !== this.movable.isMoving) {
      this.animationDir = movableDir
      this.animationMoving = this.movable.isMoving

      switch (movableDir) {
        case Direction.DOWN:
          this.currentAnimation = this.animationMoving ? this.animations.downMove : this.animations.downIdle
          break
        case Direction.LEFT:
          this.currentAnimation = this.animationMoving ? this.animations.leftMove : this.animations.leftIdle
          break
        case Direction.UP:
          this.currentAnimation = this.animationMoving ? this.animations.upMove : this.animations.upIdle
          break
        case Direction.RIGHT:
          this.currentAnimation = this.animationMoving ? this.animations.rightMove : this.animations.rightIdle
          break
      }

      this.currentAnimation.start(now)
    }
    else {
      this.currentAnimation.update(now)
    }
  }

  private determineDirectionOf(v: Vector2D): Direction {
    if (v.x >= 0 && v.y >= 0) {
      return v.x > v.y ? Direction.RIGHT : Direction.DOWN
    }
    if (v.x <= 0 && v.y >= 0) {
      return -v.x > v.y ? Direction.LEFT : Direction.DOWN
    }
    if (v.x <= 0 && v.y <= 0) {
      return -v.x > -v.y ? Direction.LEFT : Direction.UP
    }

    return v.x > -v.y ? Direction.RIGHT : Direction.UP
  }
}
