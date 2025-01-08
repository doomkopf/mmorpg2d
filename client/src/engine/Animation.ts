export class Animation {
  private i = -1
  private lastTs = 0

  constructor(
    private readonly imageIds: (string | null)[],
    private readonly frameIntervalMs: number,
    private readonly loop: boolean,
  ) {
    if (loop) {
      this.start(Date.now())
    }
  }

  start(now: number): void {
    this.i = 0
    this.lastTs = now
  }

  update(now: number): void {
    if (!this.isStopped && now - this.lastTs > this.frameIntervalMs) {
      this.lastTs = now
      if (++this.i === this.imageIds.length) {
        this.i = this.loop ? 0 : -1
      }
    }
  }

  private get isStopped(): boolean {
    return this.i == -1
  }

  get currentImageId(): string | null {
    if (this.isStopped) {
      return null
    }

    return this.imageIds[this.i]
  }
}
