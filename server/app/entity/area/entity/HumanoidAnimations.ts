export interface Animation {
    imageIds: string[]
}

export interface HumanoidAnimations {
    animations: {
        downIdle: Animation
        downMove: Animation
        leftIdle: Animation
        leftMove: Animation
        upIdle: Animation
        upMove: Animation
        rightIdle: Animation
        rightMove: Animation
        death: Animation
    }
}
