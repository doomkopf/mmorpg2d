import { Area, JoinAreaSide } from "./Area"

export function areaId(x: number, y: number): string {
  return `ground-x${x}x${y}`
}

export function areaCoordsFromId(id: string): { x: number, y: number } {
  const [, xs, ys] = id.split("x")
  return { x: Number(xs), y: Number(ys) }
}

export function areaUseCaseValidations(area: Area, requestingUserId: string): boolean {
  if (!area) {
    return false
  }

  return area.hasUser(requestingUserId)


}

export function oppositeOfSide(side: JoinAreaSide): JoinAreaSide {
  switch (side) {
    case JoinAreaSide.LEFT:
      return JoinAreaSide.RIGHT
    case JoinAreaSide.TOP:
      return JoinAreaSide.BOTTOM
    case JoinAreaSide.RIGHT:
      return JoinAreaSide.LEFT
    case JoinAreaSide.BOTTOM:
      return JoinAreaSide.TOP
  }
}
