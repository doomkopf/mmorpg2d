import { FuncVisibility, StatelessFunc } from "../../../tmp-api/core"
import { ENTITY_TEMPLATES } from "../../game-data/entity-templates"
import { sendResponseWithClientRequestId } from "../../tools"

export const getAllEntityTemplates: StatelessFunc<never> = {
    vis: FuncVisibility.pub,
    func: (lib, params, ctx) => {
        sendResponseWithClientRequestId(ctx, ENTITY_TEMPLATES)
    },
}
