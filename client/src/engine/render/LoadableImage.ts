export class LoadableImage {
    private img: HTMLImageElement | undefined

    constructor(src: string) {
        const img = new Image()
        img.src = src
        img.onload = () => {
            this.img = img
        }
    }

    get image(): HTMLImageElement | undefined {
        return this.img
    }
}
