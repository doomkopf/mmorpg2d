export interface ImageProvider {
    retrieveImage(id: string): Promise<string | undefined>
}
