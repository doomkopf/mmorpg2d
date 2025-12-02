import { EntityFunc, FuncVisibility } from "../../tmp-api/core"
import { Image } from "../entity/image/Image"
import { GetImageResponse } from "../game-shared/dto"
import { sendResponseWithClientRequestId } from "../tools"

export const getImage: EntityFunc<Image, never> = {
    vis: FuncVisibility.pub,
    func: (image, id, lib, params, ctx) => {
        if (!image) {
            const response: GetImageResponse = {}
            sendResponseWithClientRequestId(ctx, response)
            return
        }

        const response: GetImageResponse = {
            url: image.url,
        }
        sendResponseWithClientRequestId(ctx, response)
    },
}
