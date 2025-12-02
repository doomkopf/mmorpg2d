export interface ImageDropListener {
    onImageDrop(dataUrl: string, x: number, y: number): void
}

let listener: ImageDropListener | null = null

export function registerImageDropListener(l: ImageDropListener): void {
    listener = l
}

const dropzone = document.getElementById("frontbuffer") as HTMLElement

dropzone.addEventListener("dragenter", event => {
    event.preventDefault()
})

dropzone.addEventListener("dragleave", event => {
    event.preventDefault()
})

dropzone.addEventListener("dragover", event => {
    event.preventDefault()
})

dropzone.addEventListener("drop", event => {
    event.preventDefault()

    if (!event.dataTransfer) {
        return
    }

    const file = event.dataTransfer.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.addEventListener("loadend", () => {
        if (listener && reader.result) {
            listener.onImageDrop(reader.result.toString(), event.x, event.y)
        }
    })
})
