import { EngineAppContext } from "../../engine/Engine"
import { Button } from "../../engine/window/Button"
import { Coord } from "../../engine/window/Coord"
import { ItemSelectionGrid, SelectableItem } from "../../engine/window/ItemSelectionGrid"
import { Window } from "../../engine/window/Window"
import { GameContext } from "../GameContext"
import { Json } from "../server/arcturus-client/arcturus-client"
import { MessageHandler } from "../server/arcturus-client/arcturus-session"
import {
  GetEntityTemplateRequest,
  GetEntityTemplateResponse,
  JoinGameResponse,
  SetEntityTemplateRequest,
  UseCaseId,
} from "../shared/dto"
import { EntityTemplates } from "../shared/entity/template/entity-template"

export class JoinGameHandler implements MessageHandler {
  constructor(
    private readonly ctx: EngineAppContext,
    private readonly gameCtx: GameContext,
  ) {
  }

  handle(json: Json): void {
    const joinGameResponse = json as JoinGameResponse

    this.gameCtx.userId = joinGameResponse.userId

    this.initToolWindows()
  }

  private async initToolWindows() {
    const imgSelect = await this.initImageSelection(
      { x: 1, y: 1 },
      { x: 94, y: 40 },
    )
    const humanoidAnimBuilder = this.initHumanoidAnimSelection(
      { x: 1, y: 66 },
      { x: 94, y: 90 },
    )
    const templateSelect = await this.initEntityTemplateSelection(
      { x: 1, y: 41 },
      { x: 94, y: 65 },
      humanoidAnimBuilder,
    )
    const applyHumanoidAnimImageButton = new Button(
      { x: 1, y: 91 },
      { x: 94, y: 94 },
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 0, b: 0 },
      "Set image",
      {
        onButtonClick() {
          const srcItem = imgSelect.selectedItem
          if (!srcItem) {
            return
          }

          const dstItem = humanoidAnimBuilder.selectedItem
          if (!dstItem) {
            return
          }

          dstItem.imgId = srcItem.imgId
        },
      },
    )

    const { server } = this.gameCtx
    const storeHumanoidAnimButton = new Button(
      { x: 1, y: 96 },
      { x: 94, y: 99 },
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 0, b: 0 },
      "Store animation",
      {
        async onButtonClick() {
          const { selectedItem } = templateSelect
          if (!selectedItem) {
            return
          }

          const req: SetEntityTemplateRequest = {
            id: selectedItem.id,
            template: {}, // TODO
          }
          await server.request(UseCaseId.SET_ENTITY_TEMPLATE, "", "", req)
          console.log("Sent req")
        },
      },
    )

    const window = new Window(
      true,
      { x: 0, y: 0 },
      { x: 30, y: 100 },
      { r: 150, g: 150, b: 150 },
      [applyHumanoidAnimImageButton, storeHumanoidAnimButton],
      [imgSelect, templateSelect, humanoidAnimBuilder],
    )

    this.gameCtx.toolWindow = window

    this.ctx.windows.addWindow("tools", window)
  }

  private async initImageSelection(topLeft: Coord, bottomRight: Coord): Promise<ItemSelectionGrid> {
    const allImages = await this.gameCtx.imageManager.retrieveAllImagesInfo()
    const grid = new ItemSelectionGrid(
      topLeft,
      bottomRight,
      { r: 50, g: 50, b: 50 },
      allImages.map(img => ({ id: img.id, imgId: img.id, name: img.name })),
      this.gameCtx.imageManager,
    )

    this.gameCtx.imageSelectionGrid = grid

    return grid
  }

  private async initEntityTemplateSelection(topLeft: Coord, bottomRight: Coord, humanoidAnimBuilder: ItemSelectionGrid): Promise<ItemSelectionGrid> {
    const entityTemplates = await this.gameCtx.server.request(UseCaseId.GET_ALL_ENTITY_TEMPLATES, "", "", {}) as EntityTemplates

    this.gameCtx.entityTemplates = entityTemplates

    const items: SelectableItem[] = []

    for (const id in entityTemplates.templates) {
      const template = entityTemplates.templates[id]
      items.push({
        id,
        name: template.name,
        imgId: template.listImgId,
      })
    }

    const { server } = this.gameCtx

    const grid = new ItemSelectionGrid(
      topLeft,
      bottomRight,
      { r: 50, g: 50, b: 50 },
      items,
      {
        async onItemClick(item) {
          const request: GetEntityTemplateRequest = {
            id: item.id,
          }
          const response = await server.request(UseCaseId.GET_ENTITY_TEMPLATE, "", "", request) as GetEntityTemplateResponse
          if (response.template) {
            let item = humanoidAnimBuilder.findItemById("li")
            if (item) item.imgId = response.template.humanoidAnimations?.animations.leftIdle.imageIds[0]
            item = humanoidAnimBuilder.findItemById("lm1")
            if (item) item.imgId = response.template.humanoidAnimations?.animations.leftMove.imageIds[0]
            item = humanoidAnimBuilder.findItemById("lm2")
            if (item) item.imgId = response.template.humanoidAnimations?.animations.leftMove.imageIds[1]
            item = humanoidAnimBuilder.findItemById("ti")
            if (item) item.imgId = response.template.humanoidAnimations?.animations.upIdle.imageIds[0]
            item = humanoidAnimBuilder.findItemById("tm1")
            if (item) item.imgId = response.template.humanoidAnimations?.animations.upMove.imageIds[0]
            item = humanoidAnimBuilder.findItemById("tm2")
            if (item) item.imgId = response.template.humanoidAnimations?.animations.upMove.imageIds[1]
            item = humanoidAnimBuilder.findItemById("ri")
            if (item) item.imgId = response.template.humanoidAnimations?.animations.rightIdle.imageIds[0]
            item = humanoidAnimBuilder.findItemById("rm1")
            if (item) item.imgId = response.template.humanoidAnimations?.animations.rightMove.imageIds[0]
            item = humanoidAnimBuilder.findItemById("rm2")
            if (item) item.imgId = response.template.humanoidAnimations?.animations.rightMove.imageIds[1]
            item = humanoidAnimBuilder.findItemById("bi")
            if (item) item.imgId = response.template.humanoidAnimations?.animations.downIdle.imageIds[0]
            item = humanoidAnimBuilder.findItemById("bm1")
            if (item) item.imgId = response.template.humanoidAnimations?.animations.downMove.imageIds[0]
            item = humanoidAnimBuilder.findItemById("bm2")
            if (item) item.imgId = response.template.humanoidAnimations?.animations.downMove.imageIds[1]
            item = humanoidAnimBuilder.findItemById("death")
            if (item) item.imgId = response.template.humanoidAnimations?.animations.death.imageIds[0]
          }
        },

        onItemDoubleClick() {
        },
      },
    )

    this.gameCtx.entityTemplateSelectionGrid = grid

    return grid
  }

  private initHumanoidAnimSelection(topLeft: Coord, bottomRight: Coord): ItemSelectionGrid {
    return new ItemSelectionGrid(
      topLeft,
      bottomRight,
      { r: 50, g: 50, b: 50 },
      [
        { id: "li", name: "lIdle" },
        { id: "lm1", name: "lMove1" },
        { id: "lm2", name: "lMove2" },
        { id: "ti", name: "tIdle" },
        { id: "tm1", name: "tMove1" },
        { id: "tm2", name: "tMove2" },
        { id: "ri", name: "rIdle" },
        { id: "rm1", name: "rMove1" },
        { id: "rm2", name: "rMove2" },
        { id: "bi", name: "bIdle" },
        { id: "bm1", name: "bMove1" },
        { id: "bm2", name: "bMove2" },
        { id: "death", name: "death" },
      ],
      null,
    )
  }
}
