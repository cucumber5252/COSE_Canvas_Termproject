import CommandHistory from '../command/CommandHistory';
import store from '../redux/store';
import { setTool, setColor, updateCanvas, clearCanvas } from '../redux/actions';

class ToolbarController {
    constructor() {
        if (!ToolbarController.instance) {
            ToolbarController.instance = this;
        }
        return ToolbarController.instance;
    }

    static getInstance() {
        if (!ToolbarController.instance) {
            ToolbarController.instance = new ToolbarController();
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
        CommandHistory.clearHistory();
        store.dispatch(clearCanvas());
    }

    undo() {
        CommandHistory.undo();
        store.dispatch(updateCanvas());
    }

    redo() {
        CommandHistory.redo();
        store.dispatch(updateCanvas());
    }
}

const instance = ToolbarController.getInstance();
export default instance;
