import {
    startDrawing,
    stopDrawing,
    addObject,
    removeObject,
    clearCanvas as clearCanvasAction,
    updateCanvas,
} from '../redux/actions';
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
        console.log('Canvas updated');
    }

    clearCanvas() {
        const context = this.context;
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        GraphicModel.clearObjects();
        CommandHistory.clearHistory();
    }

    updateCanvas() {
        const context = this.context;
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        GraphicModel.objects.forEach((obj) => {
            context.strokeStyle = obj.color;
            context.fillStyle = obj.color;
            context.lineWidth = 2;

            if (obj.tool === 'pencil') {
                context.beginPath();
                context.moveTo(obj.x, obj.y);
                context.lineTo(obj.x, obj.y);
                context.stroke();
            } else if (obj.tool === 'eraser') {
                context.clearRect(obj.x - 10, obj.y - 10, 20, 20);
            } else if (obj.tool === 'circle') {
                context.beginPath();
                context.arc(obj.x, obj.y, 20, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
            } else if (obj.tool === 'rectangle') {
                context.beginPath();
                context.rect(obj.x - 20, obj.y - 20, 40, 40);
                context.fill();
                context.stroke();
            } else if (obj.tool === 'triangle') {
                context.beginPath();
                context.moveTo(obj.x, obj.y - 20);
                context.lineTo(obj.x - 20, obj.y + 20);
                context.lineTo(obj.x + 20, obj.y + 20);
                context.closePath();
                context.fill();
                context.stroke();
            }

            if (obj === GraphicModel.selectedObject) {
                context.strokeStyle = 'blue';
                context.lineWidth = 4;
                context.strokeRect(obj.x - 25, obj.y - 25, 50, 50);
            }
        });
    }

    getCursorPosition(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y };
    }

    selectObject(x, y, canvas) {
        const state = store.getState();
        this.selectedObject = state.objects.find((obj) => Math.abs(obj.x - x) < 20 && Math.abs(obj.y - y) < 20);
        if (this.selectedObject) {
            const selectCommand = new SelectCommand(this.selectedObject);
            CommandHistory.executeCommand(selectCommand);
            store.dispatch(updateCanvas());
            console.log(`Object selected: ${JSON.stringify(this.selectedObject)}`);
            this.showContextMenu(x, y, canvas);
        }
    }

    showContextMenu(x, y, canvas) {
        if (this.contextMenu) {
            this.contextMenu.remove();
        }

        this.contextMenu = document.createElement('div');
        this.contextMenu.style.position = 'absolute';
        this.contextMenu.style.left = `${x + canvas.offsetLeft + 530}px`;
        this.contextMenu.style.top = `${y + canvas.offsetTop + 130}px`;
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
            this.showMoveCompleteButton(canvas);
            console.log('Move mode activated');
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
            store.dispatch(updateCanvas());
            this.contextMenu.remove();
            console.log('Object deleted');
        };

        this.contextMenu.appendChild(moveButton);
        this.contextMenu.appendChild(deleteButton);
        document.body.appendChild(this.contextMenu);
    }

    showMoveCompleteButton(canvas) {
        if (this.moveCompleteButton) {
            this.moveCompleteButton.remove();
        }

        this.moveCompleteButton = document.createElement('button');
        this.moveCompleteButton.innerText = 'Complete Move';
        this.moveCompleteButton.style.position = 'absolute';
        this.moveCompleteButton.style.left = `${canvas.offsetLeft + 10}px`;
        this.moveCompleteButton.style.top = `${canvas.offsetTop + 10}px`;
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
            store.dispatch(updateCanvas());
            console.log('Move mode deactivated');
        };

        document.body.appendChild(this.moveCompleteButton);
    }

    handleMouseDown(e, canvas) {
        const { x, y } = this.getCursorPosition(e, canvas);
        const state = store.getState();
        const context = canvas.getContext('2d');

        if (this.selectedObject && this.isMoveMode) {
            this.currentCommand = new MoveCommand(this.selectedObject, x, y);
            store.dispatch(startDrawing());
        } else {
            this.previousClick = Date.now();
            if (state.currentTool === 'none') {
                this.selectObject(x, y, canvas);
            } else if (state.currentTool === 'pencil') {
                this.currentCommand = new DrawCommand();
                context.beginPath();
                context.moveTo(x, y);
                store.dispatch(startDrawing());
                console.log(`Pencil drawing started at: (${x}, ${y})`);
            } else if (state.currentTool === 'eraser') {
                this.currentCommand = new EraseCommand();
                const obj = { tool: 'eraser', x, y };
                this.currentCommand.addPoint(obj);
                context.clearRect(x - 10, y - 10, 20, 20);
                store.dispatch(removeObject(obj));
                store.dispatch(startDrawing());
                console.log(`Eraser used at: (${x}, ${y})`);
            } else {
                context.strokeStyle = state.currentColor;
                context.lineWidth = 2;
                context.fillStyle = state.currentColor;
                const shape = ShapeFactory.createShape(state.currentTool, x, y, state.currentColor);
                shape.draw(context);
                const obj = { tool: state.currentTool, x, y, color: state.currentColor };
                const command = new DrawCommand();
                command.addPoint(obj);
                command.execute(context);
                CommandHistory.executeCommand(command);
                store.dispatch(addObject(shape));
            }
        }
    }

    handleMouseMove(e, canvas) {
        const state = store.getState();
        if (!state.isDrawing) return;

        const context = canvas.getContext('2d');
        const { x, y } = this.getCursorPosition(e, canvas);

        if (state.currentTool === 'pencil' && this.currentCommand) {
            this.draw(x, y, context, state.currentColor);
        } else if (state.currentTool === 'eraser' && this.currentCommand) {
            this.erase(x, y, context);
        } else if (this.isMoveMode && this.selectedObject) {
            const moveCommand = new MoveCommand(this.selectedObject, x, y);
            CommandHistory.executeCommand(moveCommand);
            store.dispatch(updateCanvas());
            console.log(`Object moved to: (${x}, ${y})`);
        }
    }

    handleMouseUp(e, canvas) {
        store.dispatch(stopDrawing());
        const context = canvas.getContext('2d');
        context.beginPath();
        if (this.currentCommand) {
            CommandHistory.executeCommand(this.currentCommand);
            this.currentCommand = null;
        }
        if (this.isMoveMode && this.selectedObject) {
            const { x, y } = this.getCursorPosition(e, canvas);
            this.selectedObject.x = x;
            this.selectedObject.y = y;
            const moveCommand = new MoveCommand(this.selectedObject, x, y);
            CommandHistory.executeCommand(moveCommand);
            this.isMoveMode = false;
            this.selectedObject = null;
            document.body.style.cursor = 'default';
            store.dispatch(updateCanvas());
            console.log(`Object moved to: (${x}, ${y})`);
        }
    }

    draw(x, y, context, color) {
        context.strokeStyle = color;
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
        const point = { tool: 'pencil', x, y, color };
        this.currentCommand.addPoint(point);
        store.dispatch(addObject(point));
        console.log(`Pencil drawing at: (${x}, ${y})`);
    }

    erase(x, y, context) {
        const obj = { tool: 'eraser', x, y };
        this.currentCommand.addPoint(obj);
        context.clearRect(x - 10, y - 10, 20, 20);
        store.dispatch(removeObject(obj));
        console.log(`Eraser used at: (${x}, ${y})`);
    }
}

export default CanvasController.getInstance();
