import { Integer } from "./Integer"

test("should always be whole number", async () => {
  const int1 = new Integer(1.234)
  expect(int1.value).toBe(1)

  int1.value = 10.234
  expect(int1.value).toBe(10)

  expect(int1.inc()).toBe(11)
  expect(int1.dec()).toBe(10)

  int1.add(2.3)
  expect(int1.value).toBe(12)

  int1.add(-15.6)
  expect(int1.value).toBe(-3)

  int1.add(13)
  int1.multiply(2.3)
  expect(int1.value).toBe(20)

  int1.divide(2.1)
  expect(int1.value).toBe(10)
})
