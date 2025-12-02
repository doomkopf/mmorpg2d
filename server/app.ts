import { allimagesinfoDeserializeEntity } from "./app/entity/all-images-info/all-images-info-config"
import { areaInterval } from "./app/entity/area/area-config"
import { areaDeserializeEntity, areaSerializeEntity } from "./app/entity/area/area-persistency"
import { UseCaseId } from "./app/game-shared/dto"
import { attack, attack1 } from "./app/usecase/attack"
import { drawAir, drawAir1 } from "./app/usecase/creator/draw-air"
import { drawFloor, drawFloor1 } from "./app/usecase/creator/draw-floor"
import { drawTileObjects, drawTileObjects1 } from "./app/usecase/creator/draw-tile-objects"
import { getAllEntityTemplates } from "./app/usecase/creator/get-all-entity-templates"
import { getAllImageInfos, getAllImageInfos1 } from "./app/usecase/creator/get-all-image-infos"
import { getEntityTemplateFunc } from "./app/usecase/creator/get-entity-template"
import { placeEntity, placeEntity1 } from "./app/usecase/creator/place-entity"
import { placeNpcSpawnPoint, placeNpcSpawnPoint1 } from "./app/usecase/creator/place-npc-spawn-point"
import { removeImage, removeImage1, removeImage2 } from "./app/usecase/creator/remove-image"
import { removeNpcSpawnPoint, removeNpcSpawnPoint1 } from "./app/usecase/creator/remove-npc-spawn-point"
import { setEntityTemplate } from "./app/usecase/creator/set-entity-template"
import { setImageName, setImageName1 } from "./app/usecase/creator/set-image-name"
import { setPlayerVisible, setPlayerVisible1 } from "./app/usecase/creator/set-player-visible"
import { uploadImage, uploadImage1, uploadImage2 } from "./app/usecase/creator/upload-image"
import { getImage } from "./app/usecase/get-image"
import { joinArea1, joinArea2 } from "./app/usecase/internal/join-area"
import { userLoggedOut, userLoggedOut1, userLoggedOut2 } from "./app/usecase/internal/user-logged-out"
import { joinGame, onLoggedIn } from "./app/usecase/join-game"
import { movePlayer, movePlayer1 } from "./app/usecase/move-player"
import { stopPlayer, stopPlayer1 } from "./app/usecase/stop-player"
import { userToArea1 } from "./app/usecase/tools/user-to-area"
import { GammarayApp } from "./tmp-api/core"

const rpg: GammarayApp = {
    func: {
        [UseCaseId.ATTACK]: attack,
        [UseCaseId.JOIN_GAME]: joinGame,
        onLoggedIn,
        [UseCaseId.MOVE_PLAYER]: movePlayer,
        [UseCaseId.STOP_PLAYER]: stopPlayer,
        [UseCaseId.DRAW_AIR]: drawAir,
        [UseCaseId.DRAW_FLOOR]: drawFloor,
        [UseCaseId.DRAW_TILE_OBJECTS]: drawTileObjects,
        [UseCaseId.GET_ALL_ENTITY_TEMPLATES]: getAllEntityTemplates,
        [UseCaseId.GET_ALL_IMAGE_INFOS]: getAllImageInfos,
        [UseCaseId.PLACE_ENTITY]: placeEntity,
        [UseCaseId.PLACE_NPC_SPAWN_POINT]: placeNpcSpawnPoint,
        [UseCaseId.REMOVE_IMAGE]: removeImage,
        [UseCaseId.REMOVE_NPC_SPAWN_POINT]: removeNpcSpawnPoint,
        [UseCaseId.SET_IMAGE_NAME]: setImageName,
        [UseCaseId.SET_PLAYER_VISIBLE]: setPlayerVisible,
        [UseCaseId.UPLOAD_IMAGE]: uploadImage,
        [UseCaseId.GET_ENTITY_TEMPLATE]: getEntityTemplateFunc,
        [UseCaseId.SET_ENTITY_TEMPLATE]: setEntityTemplate,
    },
    entity: {
        allimagesinfo: {
            currentVersion: 1,
            deserializeEntity: allimagesinfoDeserializeEntity,
            func: {
                getAllImageInfos1,
                setImageName1,
                removeImage2,
                uploadImage2,
            },
        },
        area: {
            currentVersion: 1,
            serializeEntity: areaSerializeEntity,
            deserializeEntity: areaDeserializeEntity,
            func: {
                attack1,
                movePlayer1,
                stopPlayer1,
                joinArea2,
                userLoggedOut2,
                drawAir1,
                drawFloor1,
                drawTileObjects1,
                placeEntity1,
                placeNpcSpawnPoint1,
                removeNpcSpawnPoint1,
                setPlayerVisible1,
            },
        },
        image: {
            currentVersion: 1,
            func: {
                [UseCaseId.GET_IMAGE]: getImage,
                removeImage1,
                uploadImage1,
            },
        },
        user: {
            currentVersion: 1,
            func: {
                userToArea1,
                joinArea1,
                userLoggedOut1,
            },
        },
    },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(rpg as any).onUserLoggedOut = userLoggedOut;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(rpg.entity.area as any).interval = areaInterval

export const app = rpg
