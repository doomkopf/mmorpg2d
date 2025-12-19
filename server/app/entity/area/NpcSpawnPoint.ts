import { JsonObject } from "../../../tmp-api/core"
import { Tools } from "../../../tmp-api/tools"
import { UserFunctions } from "../../../tmp-api/user"
import { Vector2D } from "../../engine-shared/geom/Vector2D"
import { EntityTemplate } from "../../game-shared/entity/template/entity-template"
import { Area } from "./Area"

const RESPAWN_TIME_MS = 120000

export class NpcSpawnPoint {
    constructor(
        readonly templateId: string,
        readonly template: EntityTemplate,
        readonly pos: Vector2D,
        private attackableId: string | null,
        private deadSinceTs: number,
    ) {
    }

    static fromObject(obj: JsonObject): NpcSpawnPoint {
        return new NpcSpawnPoint(
            obj.templateId,
            obj.template,
            new Vector2D(obj.pos.x, obj.pos.y),
            obj.attackableId,
            obj.deadSinceTs,
        )
    }

    update(area: Area, tools: Tools, userFunctions: UserFunctions): void {
        if (this.attackableId) {
            const attackable = area.entities.attackables.get(this.attackableId)
            if (!attackable.isAlive) {
                if (!this.deadSinceTs) {
                    this.deadSinceTs = Date.now()
                } else if (Date.now() - this.deadSinceTs >= RESPAWN_TIME_MS) {
                    this.deadSinceTs = 0
                    this.attackableId = null
                }
            }
        } else {
            this.attackableId = area.createEntityFromTemplate(
                tools.randomUUID(),
                this.pos.copy(),
                this.template,
                userFunctions,
                null,
            )
        }
    }
}
