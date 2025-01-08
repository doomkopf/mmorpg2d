import { SoundItem } from "../engine/SoundManager"

export enum Sounds {
  TEST,
}

export const SOUNDS: Record<Sounds, SoundItem> = {
  [Sounds.TEST]: { file: "assets/test.mp3" },
}
