////command/CommandHistory.js////
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
        }
    }

    redo() {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.history.push(command);
        }
    }
    clearHistory() {
        this.history = [];
        this.redoStack = [];
    }
}

const instance = new CommandHistory();
export default instance;
