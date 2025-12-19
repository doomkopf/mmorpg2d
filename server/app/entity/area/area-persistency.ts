import { DeserializeEntity } from "../../../tmp-api/core"
import { Area } from "./Area"

export const areaDeserializeEntity: DeserializeEntity<Area> = (id, db) => {
    return Area.fromObject(db)
}
