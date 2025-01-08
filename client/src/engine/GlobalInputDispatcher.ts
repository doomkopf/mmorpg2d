import { EngineAppContext, GlobalInputListener } from "./Engine"

export class GlobalInputDispatcher {
  private readonly listeners = new Set<GlobalInputListener>()

  constructor(
    private readonly ctx: EngineAppContext,
  ) {
  }

  addListener(l: GlobalInputListener): void {
    this.listeners.add(l)
  }

  dispatchKeyDown(key: string): void {
    for (const l of this.listeners) {
      try {
        if (l.onKeyDown) {
          l.onKeyDown(this.ctx, key)
        }
      }
      catch (err) {
        console.error(err)
      }
    }
  }

  dispatchKeyUp(key: string): void {
    for (const l of this.listeners) {
      try {
        if (l.onKeyUp) {
          l.onKeyUp(this.ctx, key)
        }
      }
      catch (err) {
        console.error(err)
      }
    }
  }

  dispatchKeyHit(key: string): void {
    for (const l of this.listeners) {
      try {
        if (l.onKeyHit) {
          l.onKeyHit(this.ctx, key)
        }
      }
      catch (err) {
        console.error(err)
      }
    }
  }
}
