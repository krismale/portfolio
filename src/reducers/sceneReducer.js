import {SCENE_TYPES} from '../actions/types.js';

const INITIAL_STATE = {
    camPos: {},
    camera: {},
    renderBck: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case SCENE_TYPES.GO_BACK:
            return {...state, renderBck: false};
        case SCENE_TYPES.GO_TO_OBJ:
            return {...state, renderBck: true};
        case SCENE_TYPES.SET_CAM_POS:
            return {...state, camPos: action.payload};
        case SCENE_TYPES.SET_CAM:
            return {...state, camera: action.payload};
        default:
            return state;
    }
}