export class EntityComponents<C> {
  constructor(
    private readonly components: { [id: string]: C },
  ) {
  }

  put(id: string, c: C): void {
    this.components[id] = c
  }

  /**
   * let it crash: C can be undefined, but in most cases you will assume that a component is present by context.
   */
  get(id: string): C {
    return this.components[id]
  }

  remove(id: string): C {
    const c = this.get(id)
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.components[id]
    return c
  }

  has(id: string): boolean {
    return !!this.components[id]
  }

  iterate(func: (id: string, component: C) => void): void {
    for (const id in this.components) {
      func(id, this.components[id])
    }
  }

  get idsIterable(): Iterable<string> {
    return Object.keys(this.components)
  }
}
