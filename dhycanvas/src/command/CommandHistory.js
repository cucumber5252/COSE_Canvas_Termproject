// command/CommandHistory.js
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
        console.log('history' + JSON.stringify(this.history) + 'redo' + JSON.stringify(this.redoStack));
        const command = this.history.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
            // store.dispatch(updateCanvas());
        }
        console.log(
            'history after undo' + JSON.stringify(this.history) + 'redo after undo' + JSON.stringify(this.redoStack)
        );
    }

    redo() {
        console.log('history' + JSON.stringify(this.history) + 'redo' + JSON.stringify(this.redoStack));
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.history.push(command);
            // store.dispatch(updateCanvas());
        }
        console.log(
            'history after redo' + JSON.stringify(this.history) + 'redo after redo' + JSON.stringify(this.redoStack)
        );
    }

    clearHistory() {
        this.history = [];
        this.redoStack = [];
    }
}

const instance = new CommandHistory();
export default instance;
