import { UserFunctions } from "../../../../tmp-api/user";
import { Movable } from "../../../engine-shared/entity/Movable";
import { Vector2D } from "../../../engine-shared/geom/Vector2D";
import { UpdateEntitiesDto, UseCaseId } from "../../../game-shared/dto";
import { Area } from "../Area";

export class ServerMovable {
  constructor(
    private readonly pos: Vector2D,
    readonly movable: Movable,
  ) {
  }

  lookInDirectionTo(x: number, y: number, id: string, area: Area, userFunctions: UserFunctions, sendToExceptUserId: string | null): void {
    this.movable.lookInDirectionTo(x, y);
    this.sendUpdate(id, area, userFunctions, sendToExceptUserId);
  }

  moveInDirectionTo(x: number, y: number, id: string, area: Area, userFunctions: UserFunctions, sendToExceptUserId: string | null): void {
    this.movable.moveInDirectionTo(x, y);
    this.sendUpdate(id, area, userFunctions, sendToExceptUserId);
  }

  moveInDirection(dir: Vector2D, id: string, area: Area, userFunctions: UserFunctions, sendToExceptUserId: string | null): void {
    this.movable.moveInDirection(dir);
    this.sendUpdate(id, area, userFunctions, sendToExceptUserId);
  }

  stop(id: string, area: Area, userFunctions: UserFunctions, sendToExceptUserId: string | null): void {
    this.movable.stop();
    this.sendUpdate(id, area, userFunctions, sendToExceptUserId);
  }

  changeSpeed(speed: number, id: string, area: Area, userFunctions: UserFunctions, sendToExceptUserId: string | null): void {
    this.movable.changeSpeed(speed);
    this.sendUpdate(id, area, userFunctions, sendToExceptUserId);
  }

  private sendUpdate(id: string, area: Area, userFunctions: UserFunctions, sendToExceptUserId: string | null) {
    const updateEntities: UpdateEntitiesDto = {
      uc: UseCaseId.UPDATE_ENTITIES,
      entities: [{
        id,
        pos: this.pos,
        movable: {
          dir: this.movable.dir,
          speed: this.movable.currentSpeed,
          isMoving: this.movable.isMoving,
        },
      }],
    };
    area.sendToAllExcept(userFunctions, updateEntities, sendToExceptUserId);
  }
}
