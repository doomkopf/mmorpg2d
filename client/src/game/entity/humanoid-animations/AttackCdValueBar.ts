import { ValueBar } from "../../../engine/entity/Visible"

export class AttackCdValueBar implements ValueBar {
    private value: number

    constructor(
        private readonly attackIntervalMs: number,
    ) {
        this.value = attackIntervalMs
    }

    get maxV(): number {
        return this.attackIntervalMs
    }

    get v(): number {
        return this.value
    }

    get isFull(): boolean {
        return this.value === this.attackIntervalMs
    }

    drain(): void {
        this.value = 0
    }

    update(timeSinceLastIteration: number): void {
        if (this.value < this.attackIntervalMs) {
            this.value += timeSinceLastIteration
            if (this.value > this.attackIntervalMs) {
                this.value = this.attackIntervalMs
            }
        }
    }
}
