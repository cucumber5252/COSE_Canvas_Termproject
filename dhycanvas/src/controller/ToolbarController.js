////controller/ToolbarController.js////
import CommandHistory from '../command/CommandHistory';
import store from '../redux/store';
import { setTool, clearCanvas, setColor, updateCanvas, resetUpdateCanvas } from '../redux/actions';

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

    undo() {
        CommandHistory.undo();
        store.dispatch(updateCanvas());
        setTimeout(() => {
            store.dispatch(resetUpdateCanvas());
        }, 0);
    }

    redo() {
        CommandHistory.redo();
        store.dispatch(updateCanvas());
        setTimeout(() => {
            store.dispatch(resetUpdateCanvas());
        }, 0);
    }
}

const instance = new ToolbarController();
export default instance;
