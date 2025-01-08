import { EntityComponents } from "../../engine/shared/entity/EntityComponents"
import { HumanoidAnimations } from "./humanoid-animations/HumanoidAnimations"

export class GameEntitySystem {
  readonly humanoidAnimations = new EntityComponents<HumanoidAnimations>({})

  update(nowTs: number, timeSinceLastIteration: number, motionScaleFactor: number): void {
    this.humanoidAnimations.iterate((id, anim) => {
      anim.update(nowTs, timeSinceLastIteration, motionScaleFactor)
    })
  }

  removeEntity(id: string): void {
    this.humanoidAnimations.remove(id)
  }
}
