// src/controller/CanvasController.js
import { startDrawing, stopDrawing, draw, erase, clearCanvas as clearCanvasAction, addObject } from "../redux/actions";
import store from "../redux/store";

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
    const context = canvas.getContext("2d");

    if (state.currentTool === "circle" || state.currentTool === "rectangle" || state.currentTool === "triangle") {
      this.drawShape(x, y, context, state.currentTool, state.currentColor);
      store.dispatch(addObject({ tool: state.currentTool, x, y, color: state.currentColor }));
    } else {
      context.beginPath();
      context.moveTo(x, y);
    }
  }

  handleMouseMove(e, canvas) {
    const state = store.getState();
    if (!state.isDrawing) return;

    const context = canvas.getContext("2d");
    const { x, y } = this.getCursorPosition(e, canvas);

    if (state.currentTool === "pencil") {
      this.draw(x, y, context, state.currentColor);
    } else if (state.currentTool === "eraser") {
      this.erase(x, y, context);
    }
  }

  handleMouseUp(canvas) {
    store.dispatch(stopDrawing());
    const context = canvas.getContext("2d");
    context.beginPath();
  }

  draw(x, y, context, color) {
    context.strokeStyle = color;
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
    store.dispatch(draw(x, y));
  }

  erase(x, y, context) {
    context.clearRect(x - 10, y - 10, 20, 20);
    store.dispatch(erase(x, y));
  }

  drawShape(x, y, context, tool, color) {
    context.fillStyle = color;
    context.strokeStyle = color;
    if (tool === "circle") {
      context.beginPath();
      context.arc(x, y, 20, 0, 2 * Math.PI);
      context.fill();
    } else if (tool === "rectangle") {
      context.beginPath();
      context.rect(x - 20, y - 20, 40, 40);
      context.fill();
    } else if (tool === "triangle") {
      context.beginPath();
      context.moveTo(x, y - 20);
      context.lineTo(x - 20, y + 20);
      context.lineTo(x + 20, y + 20);
      context.closePath();
      context.fill();
    }
  }

  clearCanvas(canvas) {
    store.dispatch(clearCanvasAction());
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}

const instance = new CanvasController();
export default instance;
