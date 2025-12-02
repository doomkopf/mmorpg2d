import { FuncVisibility, StatelessFunc } from "../../../tmp-api/core"
import { LogLevel } from "../../../tmp-api/log"
import { SetEntityTemplateRequest, STATUS_KEY, StatusKey } from "../../game-shared/dto"
import { sendResponseWithClientRequestId } from "../../tools"

export const setEntityTemplate: StatelessFunc<SetEntityTemplateRequest> = {
    vis: FuncVisibility.pub,
    func: (lib, params, ctx) => {
        lib.log.log(LogLevel.INFO, `TODO store template id=${params.id}`)
        sendResponseWithClientRequestId(ctx, { [STATUS_KEY]: StatusKey.OK })
    },
}
