import { AttackableTemplate } from "./AttackableTemplate"
import { AttackerTemplate } from "./AttackerTemplate"
import { Faction } from "./Faction"
import { HumanoidAnimationsTemplate } from "./HumanoidAnimationsTemplate"
import { MovableAttackerTemplate } from "./MovableAttackerTemplate"
import { MovableTemplate } from "./MovableTemplate"

export interface EntityTemplate {
  movable?: MovableTemplate
  attackable?: AttackableTemplate
  attacker?: AttackerTemplate
  movableAttacker?: MovableAttackerTemplate
  humanoidAnimations?: HumanoidAnimationsTemplate
  faction?: Faction
}

export interface EntityTemplates {
  templates: {
    [id: string]: {
      name: string
      listImgId: string
      template: EntityTemplate
    }
  }
}
