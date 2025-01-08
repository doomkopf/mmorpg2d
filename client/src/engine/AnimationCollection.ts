import { Animation } from "./Animation"

export class AnimationCollection {
  constructor(
    private readonly animations: Animation[],
  ) {
  }

  start(now: number): void {
    for (const anim of this.animations) {
      anim.start(now)
    }
  }

  update(now: number): void {
    for (const anim of this.animations) {
      anim.update(now)
    }
  }

  getImageAtIndex(i: number): string | null {
    const anim = this.animations[i]
    if (!anim) {
      return null
    }

    return anim.currentImageId
  }
}
