import { Animation } from "../engine/Animation"
import { BlendingVisible } from "../engine/BlendingVisible"
import { EntitySystem } from "../engine/entity/EntitySystem"
import { Movable } from "../engine/shared/entity/Movable"
import { Vector2D } from "../engine/shared/geom/Vector2D"
import { GameEntitySystem } from "./entity/GameEntitySystem"
import { HpValueBar } from "./entity/humanoid-animations/HpValueBar"
import { HumanoidAnimations } from "./entity/humanoid-animations/HumanoidAnimations"
import { EntityDto } from "./shared/dto"

export function createEntityFromDto(engineEntities: EntitySystem, gameEntities: GameEntitySystem, dto: EntityDto): void {
    if (!dto.pos) {
        console.error("Entity has no position")
        return
    }

    const pos = new Vector2D(dto.pos.x, dto.pos.y)

    engineEntities.positionables.put(dto.id, pos)

    if (dto.movable) {
        const movable = new Movable(
            pos,
            new Vector2D(0, 0),
            dto.movable.isMoving,
            new Vector2D(dto.movable.dir.x, dto.movable.dir.y),
            dto.movable.speed,
        )
        engineEntities.movables.put(dto.id, movable)

        if (dto.humanoidAnimations) {
            const animFrameIntervalMs = 3000 / dto.movable.speed
            const dtoAnimations = dto.humanoidAnimations.animations
            const anim = new HumanoidAnimations(
                pos,
                movable,
                {
                    downIdle: new Animation(dtoAnimations.downIdle.imageIds, animFrameIntervalMs, true),
                    downMove: new Animation(dtoAnimations.downMove.imageIds, animFrameIntervalMs, true),
                    leftIdle: new Animation(dtoAnimations.leftIdle.imageIds, animFrameIntervalMs, true),
                    leftMove: new Animation(dtoAnimations.leftMove.imageIds, animFrameIntervalMs, true),
                    upIdle: new Animation(dtoAnimations.upIdle.imageIds, animFrameIntervalMs, true),
                    upMove: new Animation(dtoAnimations.upMove.imageIds, animFrameIntervalMs, true),
                    rightIdle: new Animation(dtoAnimations.rightIdle.imageIds, animFrameIntervalMs, true),
                    rightMove: new Animation(dtoAnimations.rightMove.imageIds, animFrameIntervalMs, true),
                    death: new Animation(dtoAnimations.death.imageIds, animFrameIntervalMs, true),
                },
                dto.attackable ? new HpValueBar(dto.attackable.maxHp, dto.attackable.hp) : null,
                dto.attacker ? dto.attacker.attackIntervalMs : 0,
                dto.attacker ? dto.attacker.attackRange : 1,
            )

            engineEntities.visibles.put(dto.id, new BlendingVisible(anim))
            gameEntities.humanoidAnimations.put(dto.id, anim)
        }
    }
}

export function updateEntityFromDto(engineEntities: EntitySystem, gameEntities: GameEntitySystem, dto: EntityDto): void {
    if (dto.pos) {
        const pos = engineEntities.positionables.get(dto.id)
        pos.x = dto.pos.x
        pos.y = dto.pos.y
    }

    if (dto.movable) {
        const mov = engineEntities.movables.get(dto.id)
        mov.set(
            dto.movable.dir.x,
            dto.movable.dir.y,
            dto.movable.isMoving,
            dto.movable.speed,
        )
    }

    if (dto.attackable) {
        const anim = gameEntities.humanoidAnimations.get(dto.id)
        if (anim.hp) {
            anim.hp.setHp(dto.attackable.maxHp, dto.attackable.hp)
        }
    }
}
