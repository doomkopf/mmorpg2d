import { Updatable } from "../engine/Engine"
import { ItemSelectionGrid } from "../engine/window/ItemSelectionGrid"
import { Window } from "../engine/window/Window"
import { GameArea } from "./GameArea"
import { ImageManager } from "./ImageManager"
import { Server } from "./server/Server"
import { EntityTemplates } from "./shared/entity/template/entity-template"

export class GameContext implements Updatable {
    readonly server = new Server()
    readonly imageManager = new ImageManager(this)
    toolWindow: Window | null = null
    imageSelectionGrid: ItemSelectionGrid | null = null
    entityTemplateSelectionGrid: ItemSelectionGrid | null = null

    entityTemplates!: EntityTemplates
    userId: string | null = null
    area: GameArea | null = null

    update(nowTs: number, timeSinceLastIteration: number, motionScaleFactor: number): void {
        this.area?.entities.update(nowTs, timeSinceLastIteration, motionScaleFactor)
    }
}
