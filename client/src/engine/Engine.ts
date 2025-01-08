import { Area } from "./Area"
import { AreaInputDispatcher } from "./AreaInputDispatcher"
import { Context } from "./Context"
import { GlobalInputDispatcher } from "./GlobalInputDispatcher"
import { ImageProvider } from "./ImageProvider"
import { pixelsToCoords } from "./pixel"
import { AreaRenderer } from "./render/context/AreaRenderer"
import { ContextRenderer } from "./render/context/ContextRenderer"
import { ImageContextRenderer } from "./render/context/ImageContextRenderer"
import { VisiblesRenderer } from "./render/context/VisiblesRenderer"
import { WindowRenderer } from "./render/context/WindowRenderer"
import { Renderer } from "./render/Renderer"
import { Vector2D } from "./shared/geom/Vector2D"
import { calcMotionScaleFactor } from "./shared/tools"
import { SoundManager } from "./SoundManager"
import { Windows } from "./window/Windows"

export interface GlobalInputListener {
  onKeyDown?(ctx: EngineAppContext, key: string): void

  onKeyUp?(ctx: EngineAppContext, key: string): void

  onKeyHit?(ctx: EngineAppContext, key: string): void
}

export interface AreaInputListener {
  onClick?(ctx: EngineAppContext, x: number, y: number): void

  onDoubleClick?(ctx: EngineAppContext, x: number, y: number): void

  onMouseDown?(ctx: EngineAppContext, x: number, y: number): void

  onMouseUp?(ctx: EngineAppContext, x: number, y: number): void

  onMouseMove?(ctx: EngineAppContext, x: number, y: number): void
}

export interface Updatable {
  update(nowTs: number, timeSinceLastIteration: number, motionScaleFactor: number): void
}

export interface EngineAppContext {
  readonly windows: Windows
  readonly soundManager: SoundManager
  area: Area | null
  now: number

  isKeyDown(key: string): boolean
}

export interface EngineAppInitResult {
  imageProvider: ImageProvider
  updatable: Updatable
}

export class Engine {
  private lastIterationTs = 0

  private readonly ctx: Context = new Context()

  private readonly rnd: Renderer
  private ctxRnd!: ContextRenderer

  private readonly globalInputDispatcher = new GlobalInputDispatcher(this.ctx)
  private readonly areaInputDispatcher = new AreaInputDispatcher(this.ctx)

  private updatable!: Updatable

  constructor(
    private readonly appInit: (
      ctx: EngineAppContext,
      globalInputDispatcher: GlobalInputDispatcher,
      areaInputDispatcher: AreaInputDispatcher,
    ) => Promise<EngineAppInitResult>,
  ) {
    const canvas = document.getElementById("frontbuffer") as HTMLCanvasElement
    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight

    this.rnd = new Renderer(canvas)

    canvas.onclick = (me) => {
      this.ctx.windows.onClick(me.offsetX, me.offsetY)
      // TODO for all input: if the click hit any window (or deeper): dont dispatch area input events

      const coords = this.mouseEventToCoords(me)
      this.areaInputDispatcher.dispatchClick(coords.x, coords.y)
    }

    canvas.ondblclick = (me) => {
      this.ctx.windows.onDoubleClick(me.offsetX, me.offsetY)

      const coords = this.mouseEventToCoords(me)
      this.areaInputDispatcher.dispatchDoubleClick(coords.x, coords.y)
    }

    canvas.onmousedown = (me) => {
      const coords = this.mouseEventToCoords(me)
      this.areaInputDispatcher.dispatchMouseDown(coords.x, coords.y)
    }

    canvas.onmouseup = (me) => {
      const coords = this.mouseEventToCoords(me)
      this.areaInputDispatcher.dispatchMouseUp(coords.x, coords.y)
    }

    canvas.onmousemove = (me) => {
      const coords = this.mouseEventToCoords(me)
      this.areaInputDispatcher.dispatchMouseMove(coords.x, coords.y)
    }

    canvas.onkeydown = (ev) => {
      const { keysDown } = this.ctx
      if (!keysDown.has(ev.key)) {
        keysDown.add(ev.key)
        this.globalInputDispatcher.dispatchKeyDown(ev.key)
      }
    }

    canvas.onkeyup = (ev) => {
      if (this.ctx.isKeyDown(ev.key)) {
        this.globalInputDispatcher.dispatchKeyHit(ev.key)
      }
      this.ctx.keysDown.delete(ev.key)

      this.globalInputDispatcher.dispatchKeyUp(ev.key)
    }

    // to make key events work
    canvas.tabIndex = 1000

    canvas.focus()
  }

  private mouseEventToCoords(me: MouseEvent): Vector2D {
    const { area } = this.ctx
    return pixelsToCoords(
      me.offsetX,
      me.offsetY,
      this.rnd.getWidth() / 2,
      this.rnd.getHeight() / 2,
      area ? area.camera : new Vector2D(0, 0))
  }

  async start(): Promise<void> {
    const result = await this.appInit(this.ctx, this.globalInputDispatcher, this.areaInputDispatcher)

    const imageRenderer = new ImageContextRenderer(this.rnd, result.imageProvider)
    this.ctxRnd = new ContextRenderer(
      this.rnd,
      new AreaRenderer(this.rnd, imageRenderer, new VisiblesRenderer(this.rnd, imageRenderer)),
      new WindowRenderer(this.rnd, imageRenderer),
    )
    this.updatable = result.updatable

    this.lastIterationTs = this.ctx.now

    this.recMainRefresh()
  }

  private recMainRefresh() {
    const { now } = this.ctx
    const timeSinceLastIteration = now - this.lastIterationTs
    this.lastIterationTs = now
    const motionScaleFactor = calcMotionScaleFactor(timeSinceLastIteration)

    this.update(now, timeSinceLastIteration, motionScaleFactor)

    this.ctxRnd.renderContext(this.ctx, motionScaleFactor, now)

    requestAnimationFrame(() => this.recMainRefresh())
  }

  private update(nowTs: number, timeSinceLastIteration: number, motionScaleFactor: number) {
    try {
      this.updatable.update(nowTs, timeSinceLastIteration, motionScaleFactor)
    }
    catch (e) {
      console.error(e)
    }

    const { area } = this.ctx
    if (!area) {
      return
    }

    area.update(motionScaleFactor)
  }
}
