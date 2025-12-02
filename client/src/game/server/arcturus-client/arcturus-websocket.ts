import { WebsocketFactory } from "./arcturus-client"

export interface ArcturusWebsocket {
    isOpen(): boolean

    send(data: string): void

    close(): void
}

export interface ArcturusWebsocketListener {
    onOpen(): void

    onClose(): void

    onError(): void

    onMessage(data: string): void
}

class BrowserWebsocket implements ArcturusWebsocket {
    constructor(
        private readonly ws: WebSocket,
    ) {
    }

    isOpen(): boolean {
        return this.ws.readyState === WebSocket.OPEN
    }

    send(data: string): void {
        this.ws.send(data)
    }

    close(): void {
        this.ws.close()
    }
}

export const createBrowserArcturusWebsocket: WebsocketFactory = async (url, listener) => {
    const ws = new WebSocket(url)
    ws.onopen = () => {
        listener.onOpen()
    }
    ws.onclose = () => {
        listener.onClose()
    }
    ws.onerror = () => {
        listener.onError()
    }
    ws.onmessage = (msg) => {
        listener.onMessage(msg.data)
    }
    return new BrowserWebsocket(ws)
}
