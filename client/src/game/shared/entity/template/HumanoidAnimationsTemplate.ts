import { AnimationTemplate } from "./AnimationTemplate"

export interface HumanoidAnimationsTemplate {
    animations: {
        downIdle: AnimationTemplate
        downMove: AnimationTemplate
        leftIdle: AnimationTemplate
        leftMove: AnimationTemplate
        upIdle: AnimationTemplate
        upMove: AnimationTemplate
        rightIdle: AnimationTemplate
        rightMove: AnimationTemplate
        death: AnimationTemplate
    }
}
