import { EngineAppContext, GlobalInputListener } from "../engine/Engine"
import { GlobalInputDispatcher } from "../engine/GlobalInputDispatcher"
import { GameContext } from "./GameContext"
import {
    RemoveImageRequest,
    RemoveImageResponse,
    SetPlayerVisibleRequest,
    SetPlayerVisibleResponse,
    STATUS_KEY,
    StatusKey,
    UseCaseId,
} from "./shared/dto"

export class AdminGlobalInputController implements GlobalInputListener {
    constructor(
        private readonly gameCtx: GameContext,
        globalInputDispatcher: GlobalInputDispatcher,
    ) {
        globalInputDispatcher.addListener(this)
    }

    onKeyHit(ctx: EngineAppContext, key: string): void {
        if (key === "t") {
            this.gameCtx.toolWindow?.toggleShow()
        }

        if (key === "Delete" || key === "Backspace") {
            this.deleteSelectedImage()
        }

        if (key === "0") {
            this.setVisible(false)
        }

        if (key === "9") {
            this.setVisible(true)
        }

        if (key === "l") {
            this.gameCtx.area?.toggleNpcSpawnPoints()
        }
    }

    onKeyDown(): void {
        //
    }

    onKeyUp(): void {
        //
    }

    private async deleteSelectedImage() {
        const selection = this.gameCtx.imageSelectionGrid
        if (!selection || !selection.selectedItem) {
            return
        }

        const removeImage: RemoveImageRequest = {
            id: selection.selectedItem.id,
        }
        const response = await this.gameCtx.server.request(UseCaseId.REMOVE_IMAGE, "", "", removeImage) as RemoveImageResponse
        if (response[STATUS_KEY] === StatusKey.OK) {
            selection.removeItemById(selection.selectedItem.id)
        }
    }

    private async setVisible(visible: boolean) {
        const setPlayerVisible: SetPlayerVisibleRequest = { visible }
        const response = await this.gameCtx.server.request(UseCaseId.SET_PLAYER_VISIBLE, "", "", setPlayerVisible) as SetPlayerVisibleResponse
        if (response[STATUS_KEY] !== StatusKey.OK) {
            alert(response[STATUS_KEY])
        } else {
            alert(`Visible: ${response.visible}`)
        }
    }
}
