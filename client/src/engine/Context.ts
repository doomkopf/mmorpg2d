import { Area } from "./Area"
import { EngineAppContext } from "./Engine"
import { SoundManager } from "./SoundManager"
import { Windows } from "./window/Windows"

export class Context implements EngineAppContext {
    readonly keysDown = new Set<string>()

    readonly windows = new Windows()
    readonly soundManager = new SoundManager()
    area: Area | null = null

    get now(): number {
        return Date.now()
    }

    isKeyDown(key: string): boolean {
        return this.keysDown.has(key)
    }
}
