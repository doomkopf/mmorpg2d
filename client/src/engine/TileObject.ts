import { AnimatedTile } from "./AnimatedTile";

export class TileObject {
  constructor(
    readonly anim: AnimatedTile,
    readonly isWalkable: boolean,
  ) {
  }
}
