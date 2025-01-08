import { Integer } from "./Integer"
import { TileCoord } from "./TileCoord"

test("should convert to correct tile coord", async () => {
  // the center area coord of the top-left tile
  let tileCoord = TileCoord.fromAreaCoords(1, 1)

  expect(tileCoord.x.value).toBe(0)
  expect(tileCoord.y.value).toBe(0)

  tileCoord = TileCoord.fromAreaCoords(0.5, 0.5)

  expect(tileCoord.x.value).toBe(0)
  expect(tileCoord.y.value).toBe(0)

  tileCoord = TileCoord.fromAreaCoords(1.4, 1.1)

  expect(tileCoord.x.value).toBe(0)
  expect(tileCoord.y.value).toBe(0)

  tileCoord = TileCoord.fromAreaCoords(1.5, 2.1)

  expect(tileCoord.x.value).toBe(1)
  expect(tileCoord.y.value).toBe(1)
})

test("should convert to correct area coord", async () => {
  const tileCoord = new TileCoord(new Integer(0), new Integer(1))
  const areaCoord = tileCoord.toAreaCoords()

  expect(areaCoord.x).toBe(1)
  expect(areaCoord.y).toBe(2)
})

test("should fail on negative coordinates", async () => {
  expect(() => new TileCoord(new Integer(-1), new Integer(1))).toThrow()
})
