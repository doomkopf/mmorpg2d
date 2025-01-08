import { FuncVisibility, StatelessFunc } from "gammaray-app/core";
import { LogLevel } from "gammaray-app/log";
import { LoginFinishedFunc } from "gammaray-app/user";
import { JoinGameResponse, UseCaseId } from "../game-shared/dto";
import { startJoinArea } from "./internal/join-area";

const DEFAULT_AREA_ID = "ground-x0x0";

export const joinGame: StatelessFunc<never> = {
  vis: FuncVisibility.pub,
  func: (lib, params, ctx) => {
    const userId = "timo";
    const onLoggedIn: OnLoggedIn = {
      userId,
    };
    lib.user.login(userId, "onLoggedIn", ctx, onLoggedIn);
  },
};

interface OnLoggedIn {
  userId: string;
}

export const onLoggedIn: LoginFinishedFunc<OnLoggedIn> = {
  vis: FuncVisibility.pri,
  func: (lib, params) => {
    const { userId } = params.ctx!;
    lib.log.log(LogLevel.INFO, `Logged in: ${userId}`);

    const joinGame: JoinGameResponse = {
      uc: UseCaseId.JOIN_GAME,
      userId,
    };
    lib.user.send(userId, joinGame);

    startJoinArea(lib.entityFunc, userId, DEFAULT_AREA_ID);
  },
};
