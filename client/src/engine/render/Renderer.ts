import { DirectImageRenderer } from "./DirectImageRenderer"
import { ImageRenderer } from "./ImageRenderer"

/**
 * Renders primitives and images. Encapsulates the actual rendering API e.g. html canvas.
 */
export class Renderer {
  private readonly frontCtx: CanvasRenderingContext2D
  private readonly backBuffer: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D

  readonly imageRnd: ImageRenderer

  constructor(frontBuffer: HTMLCanvasElement) {
    const frontCtx = frontBuffer.getContext("2d")
    if (!frontCtx) {
      throw "Error initializing 2d context for front buffer"
    }

    this.frontCtx = frontCtx
    this.backBuffer = document.createElement("CANVAS") as HTMLCanvasElement
    this.backBuffer.width = frontBuffer.width
    this.backBuffer.height = frontBuffer.height

    const ctx = this.backBuffer.getContext("2d")
    if (!ctx) {
      throw "Error initializing 2d context for back buffer"
    }

    ctx.font = "16px Andale Mono"

    this.ctx = ctx
    this.imageRnd = new ImageRenderer(new DirectImageRenderer(ctx))
  }

  getWidth(): number {
    return this.backBuffer.width
  }

  getHeight(): number {
    return this.backBuffer.height
  }

  fillColor(r: number, g: number, b: number): void {
    this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
  }

  strokeColor(r: number, g: number, b: number): void {
    this.ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
  }

  textColor(r: number, g: number, b: number): void {
    this.fillColor(r, g, b)
  }

  clear(): void {
    this.ctx.fillRect(0, 0, this.backBuffer.width, this.backBuffer.height)
  }

  drawRect(x1: number, y1: number, x2: number, y2: number): void {
    this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1)
  }

  strokeRect(x1: number, y1: number, x2: number, y2: number): void {
    this.ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
  }

  drawText(text: string, x: number, y: number, maxWidth?: number): void {
    this.ctx.fillText(text, x, y, maxWidth)
  }

  drawLine(x1: number, y1: number, x2: number, y2: number, width: number) {
    this.ctx.lineWidth = width

    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.closePath()

    this.ctx.stroke()
  }

  present(): void {
    this.frontCtx.drawImage(this.backBuffer, 0, 0)
  }
}
