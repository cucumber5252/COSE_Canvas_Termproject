///controller/CanvasController.js

import { startDrawing, stopDrawing, addObject, removeObject, clearCanvas as clearCanvasAction } from '../redux/actions';
import store from '../redux/store';
import { PencilDrawCommand } from '../command/PencilDrawCommand';
import { ShapeDrawCommand } from '../command/ShapeDrawCommand';
import { EraseCommand } from '../command/EraseCommand';
import CommandHistory from '../command/CommandHistory';
import GraphicModel from '../model/GraphicModel';

class CanvasController {
    constructor() {
        if (!CanvasController.instance) {
            CanvasController.instance = this;
        }
        return CanvasController.instance;
    }

    getCursorPosition(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y };
    }
    handleMouseDown(e, canvas) {
        store.dispatch(startDrawing());
        const { x, y } = this.getCursorPosition(e, canvas);
        const state = store.getState();
        const context = canvas.getContext('2d');

        if (state.currentTool === 'circle' || state.currentTool === 'rectangle' || state.currentTool === 'triangle') {
            this.drawShape(x, y, context, state.currentTool, state.currentColor);
            const obj = { tool: state.currentTool, x, y, color: state.currentColor };
            const command = new ShapeDrawCommand();
            command.addPoint(obj);
            CommandHistory.executeCommand(command);
            store.dispatch(addObject(obj));
        } else if (state.currentTool === 'pencil') {
            this.currentCommand = new PencilDrawCommand();
            context.beginPath();
            context.moveTo(x, y);
            const obj = { tool: 'pencil', x, y, color: state.currentColor };
            this.currentCommand.addPoint(obj);
            store.dispatch(addObject(obj));
        } else if (state.currentTool === 'eraser') {
            this.currentCommand = new EraseCommand();
            const obj = { tool: 'eraser', x, y };
            this.currentCommand.addPoint(obj);
            context.clearRect(x - 10, y - 10, 20, 20);
            store.dispatch(removeObject(obj));
        }
    }

    handleMouseMove(e, canvas) {
        const state = store.getState();
        if (!state.isDrawing) return;

        const context = canvas.getContext('2d');
        const { x, y } = this.getCursorPosition(e, canvas);

        if (state.currentTool === 'pencil') {
            this.draw(x, y, context, state.currentColor);
        } else if (state.currentTool === 'eraser') {
            this.erase(x, y, context);
        }
    }

    handleMouseUp(canvas) {
        store.dispatch(stopDrawing());
        const context = canvas.getContext('2d');
        context.beginPath();
        if (this.currentCommand) {
            CommandHistory.executeCommand(this.currentCommand);
            this.currentCommand = null;
        }
    }

    draw(x, y, context, color) {
        context.strokeStyle = color;
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
        const obj = { tool: 'pencil', x, y, color };
        this.currentCommand.addPoint(obj);
        store.dispatch(addObject(obj));
    }

    erase(x, y, context) {
        const obj = { tool: 'eraser', x, y };
        this.currentCommand.addPoint(obj);
        context.clearRect(x - 10, y - 10, 20, 20);
        store.dispatch(removeObject(obj));
    }

    drawShape(x, y, context, tool, color) {
        context.strokeStyle = color;
        context.lineWidth = 2;

        if (tool === 'circle') {
            context.beginPath();
            context.arc(x, y, 20, 0, 2 * Math.PI);
            context.stroke();
        } else if (tool === 'rectangle') {
            context.beginPath();
            context.rect(x - 20, y - 20, 40, 40);
            context.stroke();
        } else if (tool === 'triangle') {
            context.beginPath();
            context.moveTo(x, y - 20);
            context.lineTo(x - 20, y + 20);
            context.lineTo(x + 20, y + 20);
            context.closePath();
            context.stroke();
        }
    }

    clearCanvas(canvas) {
        store.dispatch(clearCanvasAction());
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        GraphicModel.clearObjects();
        CommandHistory.clearHistory();
    }
}

const instance = new CanvasController();
export default instance;
