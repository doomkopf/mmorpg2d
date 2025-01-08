import { percentageToPixel } from "../pixel"
import { Button } from "./Button"
import { Coord } from "./Coord"
import { ItemSelectionGrid } from "./ItemSelectionGrid"
import { PixelRect } from "./PixelRect"
import { WindowColor } from "./WindowColor"

export class Window {
  private rect: PixelRect | null = null

  constructor(
    private visible: boolean,
    private readonly topLeft: Coord,
    private readonly bottomRight: Coord,
    readonly bgColor: WindowColor,
    private readonly buttons: Button[],
    private readonly itemSelectionGrids: ItemSelectionGrid[],
  ) {
  }

  pixelRect(screenW: number, screenH: number): PixelRect {
    if (this.rect) {
      return this.rect
    }

    this.rect = new PixelRect(
      { x: percentageToPixel(this.topLeft.x, screenW), y: percentageToPixel(this.topLeft.y, screenH) },
      { x: percentageToPixel(this.bottomRight.x, screenW), y: percentageToPixel(this.bottomRight.y, screenH) },
    )

    return this.rect
  }

  get isVisible(): boolean {
    return this.visible
  }

  show(): void {
    this.visible = true
  }

  hide(): void {
    this.visible = false
  }

  toggleShow(): void {
    this.visible = !this.visible
  }

  get buttonsIterable(): Iterable<Button> {
    return this.buttons
  }

  get itemSelectionGridsIterable(): Iterable<ItemSelectionGrid> {
    return this.itemSelectionGrids
  }

  onClick(x: number, y: number): void {
    if (this.rect) {
      for (const button of this.buttonsIterable) {
        button.onClick(x, y)
      }
    }

    for (const grid of this.itemSelectionGridsIterable) {
      grid.onClick(x, y)
    }
  }

  onDoubleClick(x: number, y: number): void {
    for (const grid of this.itemSelectionGridsIterable) {
      grid.onDoubleClick(x, y)
    }
  }
}
