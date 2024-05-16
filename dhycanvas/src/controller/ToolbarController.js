// src/controller/ToolbarController.js
import { setTool, clearCanvas, setColor } from "../redux/actions";
import store from "../redux/store";

class ToolbarController {
  constructor() {
    if (!ToolbarController.instance) {
      ToolbarController.instance = this;
    }
    return ToolbarController.instance;
  }

  setTool(tool) {
    store.dispatch(setTool(tool));
  }

  setColor(color) {
    store.dispatch(setColor(color));
  }

  clearCanvas() {
    store.dispatch(clearCanvas());
  }
}

const instance = new ToolbarController();
export default instance;

//command 여기서 확장
//factory - object를 생성하는 것 분리
//state