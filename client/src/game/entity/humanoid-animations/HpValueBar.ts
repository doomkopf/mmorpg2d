import { ValueBar } from "../../../engine/entity/Visible"

export class HpValueBar implements ValueBar {
  constructor(
    private maxHp: number,
    private hp: number,
  ) {
  }

  get maxV(): number {
    return this.maxHp
  }

  get v(): number {
    return this.hp
  }

  get isFull(): boolean {
    return this.hp >= this.maxHp
  }

  setHp(maxHp: number, hp: number): void {
    if (this.hp) {
      this.maxHp = maxHp
      this.hp = hp
    }
  }
}
