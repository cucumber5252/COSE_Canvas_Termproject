// CanvasController.js
import { startDrawing, stopDrawing, addObject, removeObject, clearCanvas as clearCanvasAction } from '../redux/actions';
import store from '../redux/store';
import { DrawCommand } from '../command/DrawCommand';
import { EraseCommand } from '../command/EraseCommand';
import { MoveCommand } from '../command/MoveCommand';
import { SelectCommand } from '../command/SelectCommand';
import { DeleteCommand } from '../command/DeleteCommand';
import { ShapeFactory } from '../model/ShapeFactory';
import CommandHistory from '../command/CommandHistory';
import GraphicModel from '../model/GraphicModel';

class CanvasController {
    static instance;

    constructor() {
        if (CanvasController.instance) {
            return CanvasController.instance;
        }
        CanvasController.instance = this;
        this.canvas = null;
        this.context = null;
        this.selectedObject = null;
        this.previousClick = null;
        this.isMoveMode = false;
        this.contextMenu = null;
        this.moveCompleteButton = null;
        this.currentCommand = null;
        GraphicModel.addObserver(this);
    }

    static getInstance() {
        if (!CanvasController.instance) {
            CanvasController.instance = new CanvasController();
        }
        return CanvasController.instance;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    update() {
        this.clearCanvas(false);
        this.drawObjects(GraphicModel.objects);
    }

    getCursorPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y };
    }

    selectObject(x, y) {
        const state = store.getState();
        this.selectedObject = state.objects.find((obj) => Math.abs(obj.x - x) < 20 && Math.abs(obj.y - y) < 20);
        if (this.selectedObject) {
            const selectCommand = new SelectCommand(this.selectedObject);
            CommandHistory.executeCommand(selectCommand);
            this.update();
            this.showContextMenu(x, y);
        }
    }

    showContextMenu(x, y) {
        if (this.contextMenu) {
            this.contextMenu.remove();
        }

        this.contextMenu = document.createElement('div');
        this.contextMenu.style.position = 'absolute';
        this.contextMenu.style.left = `${x + this.canvas.offsetLeft + 520}px`;
        this.contextMenu.style.top = `${y + this.canvas.offsetTop + 180}px`;
        this.contextMenu.style.background = 'white';
        this.contextMenu.style.border = '1px solid #ccc';
        this.contextMenu.style.padding = '5px';
        this.contextMenu.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.2)';
        this.contextMenu.style.borderRadius = '8px';
        this.contextMenu.style.display = 'flex';
        this.contextMenu.style.gap = '10px';

        const moveButton = document.createElement('button');
        moveButton.innerText = 'Move';
        moveButton.style.background = '#4CAF50';
        moveButton.style.color = 'white';
        moveButton.style.border = 'none';
        moveButton.style.borderRadius = '4px';
        moveButton.style.padding = '5px 10px';
        moveButton.style.cursor = 'pointer';
        moveButton.onclick = () => {
            this.isMoveMode = true;
            document.body.style.cursor = 'move';
            this.contextMenu.remove();
            this.showMoveCompleteButton();
        };

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.style.background = '#f44336';
        deleteButton.style.color = 'white';
        deleteButton.style.border = 'none';
        deleteButton.style.borderRadius = '4px';
        deleteButton.style.padding = '5px 10px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.onclick = () => {
            const deleteCommand = new DeleteCommand(this.selectedObject);
            CommandHistory.executeCommand(deleteCommand);
            this.selectedObject = null;
            this.update();
            this.contextMenu.remove();
        };

        this.contextMenu.appendChild(moveButton);
        this.contextMenu.appendChild(deleteButton);
        document.body.appendChild(this.contextMenu);
    }

    showMoveCompleteButton() {
        if (this.moveCompleteButton) {
            this.moveCompleteButton.remove();
        }

        this.moveCompleteButton = document.createElement('button');
        this.moveCompleteButton.innerText = 'Complete Move';
        this.moveCompleteButton.style.position = 'absolute';
        this.moveCompleteButton.style.left = `${this.canvas.offsetLeft + 10}px`;
        this.moveCompleteButton.style.top = `${this.canvas.offsetTop + 10}px`;
        this.moveCompleteButton.style.background = '#2196F3';
        this.moveCompleteButton.style.color = 'white';
        this.moveCompleteButton.style.border = 'none';
        this.moveCompleteButton.style.borderRadius = '4px';
        this.moveCompleteButton.style.padding = '5px 10px';
        this.moveCompleteButton.style.cursor = 'pointer';
        this.moveCompleteButton.onclick = () => {
            this.isMoveMode = false;
            document.body.style.cursor = 'default';
            this.moveCompleteButton.remove();
            this.moveCompleteButton = null;
            if (this.selectedObject) {
                this.selectedObject.isSelected = false;
            }
            this.update();
        };

        document.body.appendChild(this.moveCompleteButton);
    }

    handleMouseDown(e) {
        const { x, y } = this.getCursorPosition(e);
        const state = store.getState();

        if (this.selectedObject && this.isMoveMode) {
            this.currentCommand = new MoveCommand(this.selectedObject, x, y);
            store.dispatch(startDrawing());
        } else {
            this.previousClick = Date.now();
            if (state.currentTool === 'none') {
                this.selectObject(x, y);
            } else if (state.currentTool === 'pencil') {
                this.currentCommand = new DrawCommand();
                this.context.beginPath();
                this.context.moveTo(x, y);
                store.dispatch(startDrawing());
            } else if (state.currentTool === 'eraser') {
                this.currentCommand = new EraseCommand();
                const obj = { tool: 'eraser', x, y };
                this.currentCommand.addPoint(obj);
                this.context.clearRect(x - 10, y - 10, 20, 20);
                store.dispatch(removeObject(obj));
                store.dispatch(startDrawing());
            } else {
                const shape = ShapeFactory.createShape(state.currentTool, x, y, state.currentColor);
                shape.draw(this.context);
                const command = new DrawCommand();
                command.addPoint(shape);
                command.execute();
                CommandHistory.executeCommand(command);
                store.dispatch(addObject(shape));
            }
        }
    }

    handleMouseMove(e) {
        const state = store.getState();
        if (!state.isDrawing) return;

        const { x, y } = this.getCursorPosition(e);

        if (state.currentTool === 'pencil' && this.currentCommand) {
            this.draw(x, y, state.currentColor);
        } else if (state.currentTool === 'eraser' && this.currentCommand) {
            this.erase(x, y);
        } else if (this.isMoveMode && this.selectedObject) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.selectedObject.x = x;
            this.selectedObject.y = y;
            this.update();
        }
    }

    handleMouseUp(e) {
        const state = store.getState();
        store.dispatch(stopDrawing());
        if (this.currentCommand) {
            if (state.currentTool === 'pencil') {
                CommandHistory.executeCommand(this.currentCommand);
            } else {
                CommandHistory.executeCommand(this.currentCommand);
            }
            this.currentCommand = null;
        }
        if (this.isMoveMode && this.selectedObject) {
            const { x, y } = this.getCursorPosition(e);
            const moveCommand = new MoveCommand(this.selectedObject, x, y);
            CommandHistory.executeCommand(moveCommand);
            this.isMoveMode = false;
            this.selectedObject = null;
            document.body.style.cursor = 'default';
            this.update();
        }
    }

    draw(x, y, color) {
        this.context.strokeStyle = color;
        this.context.lineTo(x, y);
        this.context.stroke();
        this.context.beginPath();
        this.context.moveTo(x, y);
        const point = { tool: 'pencil', x, y, color };
        this.currentCommand.addPoint(point);
    }

    erase(x, y) {
        const obj = { tool: 'eraser', x, y };
        this.currentCommand.addPoint(obj);
        this.context.clearRect(x - 10, y - 10, 20, 20);
        store.dispatch(removeObject(obj));
    }

    clearCanvas(notify = true) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (notify) {
            GraphicModel.clearObjects();
            CommandHistory.clearHistory();
        }
    }

    drawObjects(objects) {
        objects.forEach((obj) => {
            this.context.strokeStyle = obj.color;
            this.context.fillStyle = obj.color;
            this.context.lineWidth = 2;

            if (obj.draw) {
                obj.draw(this.context);
            } else if (obj.tool === 'pencil') {
                this.context.beginPath();
                this.context.moveTo(obj.x, obj.y);
                this.context.lineTo(obj.x, obj.y);
                this.context.stroke();
            } else if (obj.tool === 'eraser') {
                this.context.clearRect(obj.x - 10, obj.y - 10, 20, 20);
            }

            if (obj.isSelected) {
                this.context.strokeStyle = 'blue';
                this.context.lineWidth = 4;
                this.context.strokeRect(obj.x - 25, obj.y - 25, 50, 50);
            }
        });
    }
    selectObject(x, y) {
        const state = store.getState();
        this.selectedObject = state.objects.find((obj) => Math.abs(obj.x - x) < 20 && Math.abs(obj.y - y) < 20);
        if (this.selectedObject) {
            const selectCommand = new SelectCommand(this.selectedObject);
            CommandHistory.executeCommand(selectCommand);
            this.update();
            this.showContextMenu(x, y);
        }
    }
}

export default CanvasController.getInstance();
