import { Window } from "./Window"

export class Windows {
  private readonly windows = new Map<string, Window>()

  addWindow(name: string, window: Window): void {
    this.windows.set(name, window)
  }

  removeWindow(name: string): void {
    this.windows.delete(name)
  }

  get windowsIterable(): Iterable<Window> {
    return this.windows.values()
  }

  onClick(x: number, y: number): void {
    for (const win of this.windowsIterable) {
      win.onClick(x, y)
    }
  }

  onDoubleClick(x: number, y: number): void {
    for (const win of this.windowsIterable) {
      win.onDoubleClick(x, y)
    }
  }
}
