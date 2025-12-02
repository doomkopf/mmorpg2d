export class Integer {
    private v: number

    constructor(v: number) {
        this.v = this.toInteger(v)
    }

    get value(): number {
        return this.v
    }

    set value(v: number) {
        this.v = this.toInteger(v)
    }

    inc(): number {
        return ++this.v
    }

    dec(): number {
        return --this.v
    }

    add(v: number): number {
        this.v += this.toInteger(v)
        return this.v
    }

    multiply(v: number): number {
        this.v *= this.toInteger(v)
        return this.v
    }

    divide(v: number): number {
        this.v /= this.toInteger(v)
        return this.v
    }

    private toInteger(v: number): number {
        if (v === 0) {
            return 0
        }

        return v > 0 ? Math.floor(v) : Math.ceil(v)
    }
}
