//ㅇ들의 타입을 정의
export const SET_TOOL = "SET_TOOL";
export const SET_COLOR = "SET_COLOR";
export const ADD_OBJECT = "ADD_OBJECT";
export const REMOVE_OBJECT = "REMOVE_OBJECT";
export const CLEAR_CANVAS = "CLEAR_CANVAS";
export const START_DRAWING = "START_DRAWING";
export const STOP_DRAWING = "STOP_DRAWING";
export const DRAW = "DRAW";
export const ERASE = "ERASE";

export const setTool = (tool) => ({ type: SET_TOOL, tool });
export const setColor = (color) => ({ type: SET_COLOR, color });
export const addObject = (obj) => ({ type: ADD_OBJECT, obj });
export const removeObject = (obj) => ({ type: REMOVE_OBJECT, obj });
export const clearCanvas = () => ({ type: CLEAR_CANVAS });
export const startDrawing = () => ({ type: START_DRAWING });
export const stopDrawing = () => ({ type: STOP_DRAWING });
export const draw = (x, y) => ({ type: DRAW, x, y });
export const erase = (x, y) => ({ type: ERASE, x, y });
