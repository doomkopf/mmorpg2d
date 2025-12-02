import { FuncVisibility, StatelessFunc } from "../../tmp-api/core"
import { LogLevel } from "../../tmp-api/log"
import { LoginFinishedFunc } from "../../tmp-api/user"
import { JoinGameResponse, UseCaseId } from "../game-shared/dto"
import { startJoinArea } from "./internal/join-area"

const DEFAULT_AREA_ID = "ground-x0x0"

export const joinGame: StatelessFunc<never> = {
    vis: FuncVisibility.pub,
    func: (lib) => {
        const userId = "timo"
        const onLoggedIn: OnLoggedIn = {
            userId,
        }
        lib.user.login(userId, "onLoggedIn", onLoggedIn)
    },
}

interface OnLoggedIn {
    userId: string;
}

export const onLoggedIn: LoginFinishedFunc = {
    vis: FuncVisibility.pri,
    func: (lib, params) => {
        const onLoggedInPayload: OnLoggedIn = JSON.parse(params.ctxPayload!)
        const { userId } = onLoggedInPayload
        lib.log.log(LogLevel.INFO, `Logged in: ${userId}`)

        const joinGame: JoinGameResponse = {
            uc: UseCaseId.JOIN_GAME,
            userId,
        }
        lib.user.send(userId, joinGame)

        startJoinArea(lib.entityFunc, userId, DEFAULT_AREA_ID)
    },
}
