import { percentageToPixel, TILE_SIZE_IN_PIXEL } from "../pixel"
import { Coord } from "./Coord"
import { PixelRect } from "./PixelRect"
import { WindowColor } from "./WindowColor"

const NAV_WIDTH = 20
const ITEM_SELECTION_GRID_ITEM_W = TILE_SIZE_IN_PIXEL + 4
const ITEM_SELECTION_GRID_ITEM_H = TILE_SIZE_IN_PIXEL + 20

export interface SelectableItem {
  id: string
  imgId?: string
  name: string
}

interface ItemRect {
  item: SelectableItem
  rect: PixelRect
}

interface ItemSelectionGridPixels {
  gridRect: PixelRect
  navRectPrev: PixelRect
  navRectNext: PixelRect
  itemRects: ItemRect[]
}

export interface ItemSelectionGridListener {
  onItemClick(item: SelectableItem): void

  onItemDoubleClick(item: SelectableItem): void
}

export class ItemSelectionGrid {
  private pix: ItemSelectionGridPixels | null = null
  private maxItemsPerPage = 0

  private page = 0
  private selItem: SelectableItem | null = null

  constructor(
    private readonly topLeft: Coord,
    private readonly bottomRight: Coord,
    readonly bgColor: WindowColor,
    private readonly items: SelectableItem[],
    private readonly itemListener: ItemSelectionGridListener | null,
  ) {
  }

  addItem(item: SelectableItem): void {
    this.items.push(item)
    this.pix = null
  }

  findItemById(id: string): SelectableItem | null {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      if (item.id === id) {
        return item
      }
    }

    return null
  }

  removeItemById(id: string): void {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      if (item.id === id) {
        this.items.splice(i, 1)
        break
      }
    }

    this.pix = null
  }

  onClick(x: number, y: number): void {
    if (!this.pix) {
      return
    }

    const item = this.determineItemAt(x, y, this.pix)
    if (item) {
      this.selItem = item
      if (this.itemListener) {
        this.itemListener.onItemClick(item)
      }
    }

    if (this.pix.navRectNext.isPosInside(x, y)) {
      this.nextPage()
    }
    else if (this.pix.navRectPrev.isPosInside(x, y)) {
      this.prevPage()
    }
  }

  onDoubleClick(x: number, y: number): void {
    if (!this.pix) {
      return
    }

    const item = this.determineItemAt(x, y, this.pix)
    if (item && this.itemListener) {
      this.itemListener.onItemDoubleClick(item)
    }
  }

  findItemAt(x: number, y: number): SelectableItem | null {
    if (!this.pix) {
      return null
    }

    return this.determineItemAt(x, y, this.pix)
  }

  private determineItemAt(x: number, y: number, pixels: ItemSelectionGridPixels): SelectableItem | null {
    if (pixels.gridRect.isPosInside(x, y)) {
      for (const rect of pixels.itemRects) {
        if (rect.rect.isPosInside(x, y)) {
          return rect.item
        }
      }
    }

    return null
  }

  private calcMaxItemsPerPage(w: number, h: number) {
    this.maxItemsPerPage = Math.floor(w / ITEM_SELECTION_GRID_ITEM_W) * Math.floor(h / ITEM_SELECTION_GRID_ITEM_H)
  }

  pixels(parentX: number, parentY: number, parentW: number, parentH: number): ItemSelectionGridPixels {
    if (this.pix) {
      return this.pix
    }

    const gridRect = new PixelRect(
      {
        x: parentX + percentageToPixel(this.topLeft.x, parentW),
        y: parentY + percentageToPixel(this.topLeft.y, parentH),
      },
      {
        x: parentX + percentageToPixel(this.bottomRight.x, parentW),
        y: parentY + percentageToPixel(this.bottomRight.y, parentH),
      },
    )

    if (!this.maxItemsPerPage) {
      this.calcMaxItemsPerPage(gridRect.max.x - gridRect.min.x, gridRect.max.y - gridRect.min.y)
    }

    const itemRects: ItemRect[] = []

    let { x, y } = gridRect.min

    for (let i = this.page * this.maxItemsPerPage; i < this.items.length; i++) {
      const item = this.items[i]

      itemRects.push({
        item,
        rect: new PixelRect(
          { x, y },
          { x: x + ITEM_SELECTION_GRID_ITEM_W, y: y + ITEM_SELECTION_GRID_ITEM_H },
        ),
      })

      x += ITEM_SELECTION_GRID_ITEM_W
      if (x + ITEM_SELECTION_GRID_ITEM_W > gridRect.max.x) {
        x = gridRect.min.x
        y += ITEM_SELECTION_GRID_ITEM_H
        if (y + ITEM_SELECTION_GRID_ITEM_H > gridRect.max.y) {
          break
        }
      }
    }

    const centerY = gridRect.min.y + ((gridRect.max.y - gridRect.min.y) / 2)

    this.pix = {
      gridRect,
      itemRects,
      navRectPrev: new PixelRect(
        { x: gridRect.max.x, y: gridRect.min.y },
        { x: gridRect.max.x + NAV_WIDTH, y: centerY },
      ),
      navRectNext: new PixelRect(
        { x: gridRect.max.x, y: centerY },
        { x: gridRect.max.x + NAV_WIDTH, y: gridRect.max.y },
      ),
    }

    return this.pix
  }

  get selectedItem(): SelectableItem | null {
    return this.selItem
  }

  nextPage(): void {
    this.page++
    this.pix = null
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--
      this.pix = null
    }
  }
}
