export function roughlyEquals(v1: number, v2: number, epsilon: number): boolean {
    return Math.abs(v1 - v2) < epsilon
}
