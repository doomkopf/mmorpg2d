export interface AnimatedTile {
    imgId: string | null

    update(now: number): void
}
