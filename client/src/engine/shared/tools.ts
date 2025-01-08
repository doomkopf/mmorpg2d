export function calcMotionScaleFactor(timeSinceLastIteration: number): number {
  return timeSinceLastIteration / 100
}
