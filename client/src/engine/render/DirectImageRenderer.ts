export class DirectImageRenderer {
  constructor(
    private readonly ctx: CanvasRenderingContext2D,
  ) {
  }

  drawImage(img: HTMLImageElement, x: number, y: number, w: number, h: number) {
    this.ctx.drawImage(img, x, y, w, h)
  }
}
