export interface SoundItem {
  file: string
}

export class SoundManager {
  private readonly map = new Map<number, HTMLAudioElement>()

  initSounds(sounds: { [id: number]: SoundItem }): void {
    for (const id in sounds) {
      const audio = document.createElement("audio")
      audio.src = sounds[id].file
      this.map.set(Number(id), audio)
    }
  }

  play(id: number, loop: boolean): void {
    const audio = this.map.get(id)
    if (!audio) {
      return
    }

    audio.currentTime = 0
    audio.loop = loop
    audio.play()
  }

  stop(id: number): void {
    const audio = this.map.get(id)
    if (!audio) {
      return
    }

    audio.pause()
  }
}
