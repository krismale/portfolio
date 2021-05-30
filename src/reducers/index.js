import {combineReducers} from 'redux';
import sceneReducer from './sceneReducer';

export default combineReducers({
    scene: sceneReducer
})