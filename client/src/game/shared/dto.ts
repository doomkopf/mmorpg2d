import { EntityTemplate } from "./entity/template/entity-template"

export const USE_CASE_ID = "uc"
export const STATUS_KEY = "s"

interface UseCaseDto {
    [USE_CASE_ID]: UseCaseId
}

export enum UseCaseId {
    NOOP,
    UPLOAD_IMAGE,
    GET_IMAGE,
    REMOVE_IMAGE,
    SET_IMAGE_NAME,
    GET_ALL_IMAGE_INFOS,
    GET_ALL_ENTITY_TEMPLATES,
    GET_ENTITY_TEMPLATE,
    SET_ENTITY_TEMPLATE,
    JOIN_GAME,
    JOIN_AREA,
    SPAWN_ENTITY,
    DESPAWN_ENTITY,
    UPDATE_ENTITIES,
    MOVE_PLAYER,
    STOP_PLAYER,
    PLACE_ENTITY,
    DRAW_FLOOR,
    UPDATE_FLOOR,
    DRAW_TILE_OBJECTS,
    UPDATE_TILE_OBJECTS,
    DRAW_AIR,
    UPDATE_AIR,
    ATTACK,
    DEATH,
    SET_PLAYER_VISIBLE,
    PLACE_NPC_SPAWN_POINT,
    REMOVE_NPC_SPAWN_POINT,
    UPDATE_NPC_SPAWN_POINTS,
}

export enum StatusKey {
    NONE,
    UNDEFINED_ERROR,
    OK,
}

export interface EntityDto {
    id: string
    pos?: PositionableDto
    movable?: MovableDto
    attackable?: AttackableDto
    attacker?: AttackerDto
    humanoidAnimations?: HumanoidAnimationsDto
}

export interface UpdateEntitiesDto extends UseCaseDto {
    entities: EntityDto[]
}

export interface UploadImageRequest {
    url: string
    id?: string
}

export interface UploadImageResponse {
    [STATUS_KEY]: StatusKey
    imgId?: string
    isNew?: boolean
}

export interface GetImageResponse {
    url?: string
}

export interface RemoveImageRequest {
    id: string
}

export interface RemoveImageResponse {
    [STATUS_KEY]: StatusKey
}

export interface SetImageNameRequest {
    id: string
    name: string
}

export interface SetImageNameResponse {
    [STATUS_KEY]: StatusKey
    name: string
}

export interface GetAllImageInfosResponse {
    infos: { [id: string]: { name: string } }
}

export interface JoinGameResponse extends UseCaseDto {
    userId: string
}

export interface TileObjectDto {
    anim: AnimatedTileDto
    w: boolean
}

export interface Vector2DDto {
    x: number
    y: number
}

export type PositionableDto = Vector2DDto

export interface MovableDto {
    isMoving: boolean
    dir: Vector2DDto
    speed: number
}

export interface AnimationDto {
    imageIds: string[]
}

export interface HumanoidAnimationsDto {
    animations: {
        downIdle: AnimationDto
        downMove: AnimationDto
        leftIdle: AnimationDto
        leftMove: AnimationDto
        upIdle: AnimationDto
        upMove: AnimationDto
        rightIdle: AnimationDto
        rightMove: AnimationDto
        death: AnimationDto
    }
}

export interface AttackableDto {
    maxHp: number
    hp: number
}

export interface AttackerDto {
    attackRange: number
    attackIntervalMs: number
}

export interface PortalDto {
    leaveTile: { x: number, y: number }
    enterTile: { x: number, y: number }
}

export interface NpcSpawnPointDto {
    id: string
    templateId: string
    pos: Vector2DDto
}

export type AnimatedTileDto = (string | null)[]

export interface AreaDto {
    floor: string[][]
    objects: (TileObjectDto | null)[][]
    air: (string | null)[][]
    entities: EntityDto[]
    portals: PortalDto[]
    npcSpawnPoints: NpcSpawnPointDto[]
}

export interface JoinAreaDto extends UseCaseDto {
    area: AreaDto
}

export interface SpawnEntityDto extends UseCaseDto {
    entity: EntityDto
}

export interface DespawnEntityDto extends UseCaseDto {
    id: string
}

export interface MovePlayerRequest {
    pos: PositionableDto
    dir: Vector2DDto
}

export interface StopPlayerRequest {
    pos: PositionableDto
}

export interface PlaceEntityRequest {
    templateId: string
    pos: Vector2DDto
}

export interface DrawFloorRequest {
    id: string
    min: Vector2DDto
    max: Vector2DDto
}

export interface UpdateFloorDto extends UseCaseDto {
    floor: string[][]
}

export interface DrawTileObjectsRequest {
    id: string | null
    w: boolean
    stackAnim: boolean
    min: Vector2DDto
    max: Vector2DDto
}

export interface UpdateTileObjectsDto extends UseCaseDto {
    objects: (TileObjectDto | null)[][]
}

export interface DrawAirRequest {
    id?: string
    min: Vector2DDto
    max: Vector2DDto
}

export interface UpdateAirDto extends UseCaseDto {
    air: (string | null)[][]
}

export interface EntityAttackedDto extends UseCaseDto {
    id: string
}

export interface EntityDiedDto extends UseCaseDto {
    id: string
}

export interface SetPlayerVisibleRequest {
    visible: boolean
}

export interface SetPlayerVisibleResponse {
    [STATUS_KEY]: StatusKey
    visible: boolean
}

export interface PlaceNpcSpawnPointRequest {
    pos: Vector2DDto
    templateId: string
}

export interface RemoveNpcSpawnPointRequest {
    id: string
}

export interface UpdateNpcSpawnPointsDto extends UseCaseDto {
    npcSpawnPoints: NpcSpawnPointDto[]
}

export interface GetEntityTemplateRequest {
    id: string
}

export interface GetEntityTemplateResponse {
    [STATUS_KEY]: StatusKey
    template?: EntityTemplate
}

export interface SetEntityTemplateRequest {
    id: string
    template: EntityTemplate
}
