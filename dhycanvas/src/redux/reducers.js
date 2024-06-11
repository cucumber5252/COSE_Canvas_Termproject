// src/redux/reducers.js
import {
    SET_TOOL,
    SET_COLOR,
    ADD_OBJECT,
    REMOVE_OBJECT,
    CLEAR_CANVAS,
    START_DRAWING,
    STOP_DRAWING,
    UPDATE_CANVAS,
    RESET_CLEAR_CANVAS,
    RESET_UPDATE_CANVAS,
} from './actions';

const initialState = {
    objects: [],
    currentTool: 'none',
    currentColor: '#000000',
    isDrawing: false,
    shouldClearCanvas: false,
    shouldUpdateCanvas: false,
};

const graphicReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TOOL:
            return { ...state, currentTool: action.tool };
        case SET_COLOR:
            return { ...state, currentColor: action.color };
        case ADD_OBJECT:
            return { ...state, objects: [...state.objects, action.obj] };
        case REMOVE_OBJECT:
            return { ...state, objects: state.objects.filter((obj) => obj !== action.obj) };
        case CLEAR_CANVAS:
            return { ...state, objects: [], shouldClearCanvas: true };
        case START_DRAWING:
            return { ...state, isDrawing: true };
        case STOP_DRAWING:
            return { ...state, isDrawing: false };
        case UPDATE_CANVAS:
            return { ...state, shouldUpdateCanvas: true };
        case RESET_CLEAR_CANVAS:
            return { ...state, shouldClearCanvas: false };
        case RESET_UPDATE_CANVAS:
            return { ...state, shouldUpdateCanvas: false };
        default:
            return state;
    }
};

export default graphicReducer;
