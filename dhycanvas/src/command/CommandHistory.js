import store from '../redux/store';
import { updateCanvas } from '../redux/actions';

class CommandHistory {
    constructor() {
        this.history = [];
        this.redoStack = [];
    }

    executeCommand(command) {
        command.execute();
        this.history.push(command);
        this.redoStack = [];
    }

    undo() {
        const command = this.history.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
            store.dispatch(updateCanvas());
        }
    }

    redo() {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.history.push(command);
            store.dispatch(updateCanvas());
        }
    }

    clearHistory() {
        this.history = [];
        this.redoStack = [];
    }
}

const instance = new CommandHistory();
export default instance;
