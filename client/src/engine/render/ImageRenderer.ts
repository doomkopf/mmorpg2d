import { DirectImageRenderer } from "./DirectImageRenderer"
import { LoadableImage } from "./LoadableImage"

export class ImageRenderer {
    private readonly images = new Map<string, LoadableImage>()
    private readonly defaultImage: LoadableImage
    private lastImageId = ""
    private lastImage: LoadableImage | null = null

    constructor(
        private readonly rnd: DirectImageRenderer,
    ) {
        this.defaultImage = new LoadableImage("assets/default-tile.png")
    }

    declareImage(src: string, id: string): void {
        this.images.set(id, new LoadableImage(src))
    }

    isImageDeclared(id: string): boolean {
        return this.images.has(id)
    }

    private getImage(id: string): LoadableImage | null {
        if (id === this.lastImageId && this.lastImage) {
            return this.lastImage
        }

        const img = this.images.get(id)
        if (!img) {
            return null
        }

        this.lastImageId = id
        this.lastImage = img

        return img
    }

    drawImage(id: string, x: number, y: number, w: number, h: number): boolean {
        let img = this.getImage(id)
        let imageWasPresent = true
        if (!img) {
            img = this.defaultImage
            imageWasPresent = false
        }

        const htmlImg = img.image
        if (htmlImg) {
            this.rnd.drawImage(htmlImg, x, y, w, h)
        }

        return imageWasPresent
    }
}
