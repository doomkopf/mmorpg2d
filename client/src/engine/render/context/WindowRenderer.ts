import { Button } from "../../window/Button"
import { ItemSelectionGrid } from "../../window/ItemSelectionGrid"
import { Window } from "../../window/Window"
import { Windows } from "../../window/Windows"
import { Renderer } from "../Renderer"
import { ImageContextRenderer } from "./ImageContextRenderer"

export class WindowRenderer {
    constructor(
        private readonly rnd: Renderer,
        private readonly imageRenderer: ImageContextRenderer,
    ) {
    }

    renderWindows(windows: Windows) {
        for (const window of windows.windowsIterable) {
            if (window.isVisible) {
                this.renderWindow(window)
            }
        }
    }

    private renderWindow(window: Window) {
        this.rnd.fillColor(window.bgColor.r, window.bgColor.g, window.bgColor.b)

        const pixelRect = window.pixelRect(this.rnd.getWidth(), this.rnd.getHeight())

        this.rnd.drawRect(
            pixelRect.min.x,
            pixelRect.min.y,
            pixelRect.max.x,
            pixelRect.max.y,
        )

        const winW = pixelRect.max.x - pixelRect.min.x
        const winH = pixelRect.max.y - pixelRect.min.y

        for (const button of window.buttonsIterable) {
            this.renderButton(button, pixelRect.min.x, pixelRect.min.y, winW, winH)
        }

        for (const grid of window.itemSelectionGridsIterable) {
            this.renderItemSelectionGrid(grid, pixelRect.min.x, pixelRect.min.y, winW, winH)
        }
    }

    private renderButton(
        button: Button,
        parentX: number,
        parentY: number,
        parentW: number,
        parentH: number,
    ) {
        const pixelRect = button.pixelRect(parentX, parentY, parentW, parentH)

        this.rnd.fillColor(button.color.r, button.color.g, button.color.b)
        this.rnd.drawRect(pixelRect.min.x, pixelRect.min.y, pixelRect.max.x, pixelRect.max.y)

        this.rnd.textColor(button.textColor.r, button.textColor.g, button.textColor.b)
        this.rnd.drawText(button.text, pixelRect.min.x + (pixelRect.max.x / 3), pixelRect.max.y - 4)
    }

    private renderItemSelectionGrid(
        grid: ItemSelectionGrid,
        parentX: number,
        parentY: number,
        parentW: number,
        parentH: number,
    ) {
        const pixels = grid.pixels(parentX, parentY, parentW, parentH)

        this.rnd.fillColor(grid.bgColor.r, grid.bgColor.g, grid.bgColor.b)
        this.rnd.drawRect(pixels.gridRect.min.x, pixels.gridRect.min.y, pixels.gridRect.max.x, pixels.gridRect.max.y)

        this.rnd.fillColor(200, 0, 0)
        this.rnd.drawRect(pixels.navRectPrev.min.x, pixels.navRectPrev.min.y, pixels.navRectPrev.max.x, pixels.navRectPrev.max.y)

        this.rnd.fillColor(0, 0, 200)
        this.rnd.drawRect(pixels.navRectNext.min.x, pixels.navRectNext.min.y, pixels.navRectNext.max.x, pixels.navRectNext.max.y)

        for (const rect of pixels.itemRects) {
            if (rect.item.imgId) {
                this.imageRenderer.drawTile(rect.item.imgId, rect.rect.min.x, rect.rect.min.y)
            }

            this.rnd.textColor(200, 200, 200)
            this.rnd.drawText(rect.item.name, rect.rect.min.x, rect.rect.max.y - 4)

            const selItem = grid.selectedItem
            if (selItem && selItem.id === rect.item.id) {
                this.rnd.strokeColor(200, 0, 0)
                this.rnd.strokeRect(rect.rect.min.x, rect.rect.min.y, rect.rect.max.x, rect.rect.max.y)
            }
        }
    }
}
