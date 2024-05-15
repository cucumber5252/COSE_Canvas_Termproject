// CanvasController.js
import GraphicModel from '../model/GraphicModel';

class CanvasController {
    constructor() {
        this.isDrawing = false;
    }

    handleMouseDown(e, canvas) {
        this.isDrawing = true;
        const context = canvas.getContext('2d');
        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;
        context.beginPath();
        context.moveTo(x, y);
    }

    handleMouseMove(e, canvas) {
        if (!this.isDrawing) return;
        const context = canvas.getContext('2d');
        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;
        if (GraphicModel.currentTool === 'pencil') {
            this.draw(x, y, context);
        } else if (GraphicModel.currentTool === 'eraser') {
            this.erase(x, y, context);
        }
    }

    handleMouseUp(canvas) {
        this.isDrawing = false;
        const context = canvas.getContext('2d');
        context.beginPath();
    }

    draw(x, y, context) {
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
    }

    erase(x, y, context) {
        context.clearRect(x - 10, y - 10, 20, 20);
    }

    clearCanvas(canvas) {
        if (GraphicModel.shouldClearCanvas) {
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            GraphicModel.clearAcknowledged();
        }
    }
}

export default new CanvasController();
