import { JsonObject } from "../../../tmp-api/core"
import { Tools } from "../../../tmp-api/tools"
import { UserFunctions } from "../../../tmp-api/user"
import { mapObjectValues } from "../../tools"
import { Area } from "./Area"
import { NpcSpawnPoint } from "./NpcSpawnPoint"

export class NpcSpawnPoints {
    constructor(
        private readonly npcSpawnPoints: Record<string, NpcSpawnPoint>,
    ) {
    }

    static fromObject(obj: JsonObject): NpcSpawnPoints {
        return new NpcSpawnPoints(mapObjectValues(
            obj.npcSpawnPoints as Record<string, JsonObject>,
            raw => NpcSpawnPoint.fromObject(raw),
        ))
    }

    addNpcSpawnPoint(p: NpcSpawnPoint, tools: Tools): string {
        const id = tools.randomUUID()
        this.npcSpawnPoints[id] = p
        return id
    }

    removeNpcSpawnPoint(id: string): void {
        delete this.npcSpawnPoints[id]
    }

    update(area: Area, tools: Tools, userFunctions: UserFunctions): void {
        for (const id in this.npcSpawnPoints) {
            const npcSpawnPoint = this.npcSpawnPoints[id]
            npcSpawnPoint.update(area, tools, userFunctions)
        }
    }

    iterate(func: (id: string, sp: NpcSpawnPoint) => void): void {
        for (const id in this.npcSpawnPoints) {
            func(id, this.npcSpawnPoints[id])
        }
    }
}
