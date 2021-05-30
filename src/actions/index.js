import {SCENE_TYPES} from './types.js';

export const goBack = () => {
    return {
        type: SCENE_TYPES.GO_BACK
        //NO PAYLOAD
    }
}

export const gotoObj = () => {
    return {
        type: SCENE_TYPES.GO_TO_OBJ
    }
}

export const setCamPos = (position) => {
    return {
        type: SCENE_TYPES.SET_CAM_POS,
        payload: position
    }
}

export const setActiveCam = (camera) => {
    return {
        type: SCENE_TYPES.SET_CAM,
        payload: camera
    }
}