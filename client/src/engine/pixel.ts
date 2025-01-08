import { Vector2D } from "./shared/geom/Vector2D"

/*
Fundamental coordinate system rule:
- The center of the upper left tile is x=1,y=1
*/

export const TILE_SIZE_IN_PIXEL = 64
export const HALF_TILE_SIZE_IN_PIXEL = TILE_SIZE_IN_PIXEL / 2

export function pixelsToCoords(x: number, y: number, w2: number, h2: number, cam: Vector2D): Vector2D {
  return new Vector2D(
    pixelToCoordTransform(x, cam.x, w2),
    pixelToCoordTransform(y, cam.y, h2))
}

function pixelToCoordTransform(c: number, cam: number, d2: number): number {
  return pixelToCoord((c + coordToPixel(cam)) - d2)
}

function pixelToCoord(v: number): number {
  return (v + HALF_TILE_SIZE_IN_PIXEL) / TILE_SIZE_IN_PIXEL
}

export function coordsToPixels(x: number, y: number, w2: number, h2: number, cam: Vector2D): { x: number, y: number } {
  return {
    x: coordToPixelTransform(x, cam.x, w2),
    y: coordToPixelTransform(y, cam.y, h2),
  }
}

function coordToPixelTransform(c: number, cam: number, d2: number): number {
  c = coordToPixel(c)
  cam = coordToPixel(cam)
  return (c - cam) + d2
}

function coordToPixel(v: number): number {
  return Math.round((v * TILE_SIZE_IN_PIXEL) - HALF_TILE_SIZE_IN_PIXEL)
}

export function percentageToFactor(percentage: number): number {
  return percentage / 100
}

export function percentageToPixel(percentage: number, pixelValue: number): number {
  return Math.round(percentageToFactor(percentage) * pixelValue)
}

export function isPosInsideRect(
  x: number,
  y: number,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
): boolean {
  return minX <= x && x <= maxX
    && minY <= y && y <= maxY
}
