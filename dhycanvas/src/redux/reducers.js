// src/redux/reducers.js
import {
  SET_TOOL,
  SET_COLOR,
  ADD_OBJECT,
  REMOVE_OBJECT,
  CLEAR_CANVAS,
  START_DRAWING,
  STOP_DRAWING,
  DRAW,
  ERASE,
} from "./actions";

const initialState = {
  objects: [],
  currentTool: "none",
  currentColor: "#000000",
  isDrawing: false,
  shouldClearCanvas: false,
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
    case DRAW:
      // Drawing logic can be handled here
      return state;
    case ERASE:
      // Erasing logic can be handled here
      return state;
    default:
      return { ...state, shouldClearCanvas: false };
  }
};

export default graphicReducer;
