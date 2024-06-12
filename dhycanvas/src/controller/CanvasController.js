// CanvasController.js
import {
  startDrawing,
  stopDrawing,
  addObject,
  removeObject,
  clearCanvas as clearCanvasAction,
  updateCanvas,
} from "../redux/actions";
import store from "../redux/store";
import { PencilDrawCommand } from "../command/PencilDrawCommand";
import { ShapeDrawCommand } from "../command/ShapeDrawCommand";
import { EraseCommand } from "../command/EraseCommand";
import { MoveCommand } from "../command/MoveCommand";
import { SelectCommand } from "../command/SelectCommand";
import { DeleteCommand } from "../command/DeleteCommand";
import CommandHistory from "../command/CommandHistory";
import GraphicModel from "../model/GraphicModel";

class CanvasController {
  constructor() {
    if (!CanvasController.instance) {
      CanvasController.instance = this;
      this.selectedObject = null;
      this.previousClick = null;
      this.isMoveMode = false;
      this.contextMenu = null;
      this.moveCompleteButton = null;
    }
    return CanvasController.instance;
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
      store.dispatch(updateCanvas()); // 선택 시 캔버스 업데이트
      console.log(`Object selected: ${JSON.stringify(this.selectedObject)}`);
      this.showContextMenu(x, y, canvas);
    }
  }

  showContextMenu(x, y, canvas) {
    if (this.contextMenu) {
      this.contextMenu.remove();
    }

    this.contextMenu = document.createElement("div");
    this.contextMenu.style.position = "absolute";
    this.contextMenu.style.left = `${x + canvas.offsetLeft}px`;
    this.contextMenu.style.top = `${y + canvas.offsetTop - 40}px`;
    this.contextMenu.style.background = "white";
    this.contextMenu.style.border = "1px solid #ccc";
    this.contextMenu.style.padding = "5px";
    this.contextMenu.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.2)";
    this.contextMenu.style.borderRadius = "8px"; // 모서리 둥글게
    this.contextMenu.style.display = "flex";
    this.contextMenu.style.gap = "10px"; // 버튼 간격

    const moveButton = document.createElement("button");
    moveButton.innerText = "Move";
    moveButton.style.background = "#4CAF50";
    moveButton.style.color = "white";
    moveButton.style.border = "none";
    moveButton.style.borderRadius = "4px";
    moveButton.style.padding = "5px 10px";
    moveButton.style.cursor = "pointer";
    moveButton.onclick = () => {
      this.isMoveMode = true;
      document.body.style.cursor = "move";
      this.contextMenu.remove();
      this.showMoveCompleteButton(canvas);
      console.log("Move mode activated");
    };

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.style.background = "#f44336";
    deleteButton.style.color = "white";
    deleteButton.style.border = "none";
    deleteButton.style.borderRadius = "4px";
    deleteButton.style.padding = "5px 10px";
    deleteButton.style.cursor = "pointer";
    deleteButton.onclick = () => {
      const deleteCommand = new DeleteCommand(this.selectedObject);
      CommandHistory.executeCommand(deleteCommand);
      this.selectedObject = null;
      store.dispatch(updateCanvas());
      this.contextMenu.remove();
      console.log("Object deleted");
    };

    this.contextMenu.appendChild(moveButton);
    this.contextMenu.appendChild(deleteButton);
    document.body.appendChild(this.contextMenu);
  }

  showMoveCompleteButton(canvas) {
    if (this.moveCompleteButton) {
      this.moveCompleteButton.remove();
    }

    this.moveCompleteButton = document.createElement("button");
    this.moveCompleteButton.innerText = "Complete Move";
    this.moveCompleteButton.style.position = "absolute";
    this.moveCompleteButton.style.left = `${canvas.offsetLeft + 10}px`; // 화면 왼쪽 상단 고정
    this.moveCompleteButton.style.top = `${canvas.offsetTop + 10}px`;
    this.moveCompleteButton.style.background = "#2196F3";
    this.moveCompleteButton.style.color = "white";
    this.moveCompleteButton.style.border = "none";
    this.moveCompleteButton.style.borderRadius = "4px";
    this.moveCompleteButton.style.padding = "5px 10px";
    this.moveCompleteButton.style.cursor = "pointer";
    this.moveCompleteButton.onclick = () => {
      this.isMoveMode = false;
      document.body.style.cursor = "default";
      this.moveCompleteButton.remove();
      this.moveCompleteButton = null;
      if (this.selectedObject) {
        this.selectedObject.isSelected = false; // 선택 상태 해제
      }
      store.dispatch(updateCanvas());
      console.log("Move mode deactivated");
    };

    document.body.appendChild(this.moveCompleteButton);
  }

  handleMouseDown(e, canvas) {
    const { x, y } = this.getCursorPosition(e, canvas);
    const state = store.getState();
    const context = canvas.getContext("2d");

    if (this.selectedObject && this.isMoveMode) {
      this.currentCommand = new MoveCommand(this.selectedObject, x, y);
      store.dispatch(startDrawing());
    } else {
      this.previousClick = Date.now();
      if (state.currentTool === "none") {
        this.selectObject(x, y, canvas);
      } else if (
        state.currentTool === "circle" ||
        state.currentTool === "rectangle" ||
        state.currentTool === "triangle"
      ) {
        this.drawShape(x, y, context, state.currentTool, state.currentColor);
        const obj = { tool: state.currentTool, x, y, color: state.currentColor };
        const command = new ShapeDrawCommand();
        command.addPoint(obj);
        CommandHistory.executeCommand(command);
        store.dispatch(addObject(obj));
        console.log(`Shape drawn: ${JSON.stringify(obj)}`);
      } else if (state.currentTool === "pencil") {
        this.currentCommand = new PencilDrawCommand();
        context.beginPath();
        context.moveTo(x, y);
        store.dispatch(startDrawing());
        console.log(`Pencil drawing started at: (${x}, ${y})`);
      } else if (state.currentTool === "eraser") {
        this.currentCommand = new EraseCommand();
        const obj = { tool: "eraser", x, y };
        this.currentCommand.addPoint(obj);
        context.clearRect(x - 10, y - 10, 20, 20);
        store.dispatch(removeObject(obj));
        console.log(`Eraser used at: (${x}, ${y})`);
      }
    }
  }

  handleMouseMove(e, canvas) {
    const state = store.getState();
    if (!state.isDrawing) return;

    const context = canvas.getContext("2d");
    const { x, y } = this.getCursorPosition(e, canvas);

    if (state.currentTool === "pencil" && this.currentCommand) {
      this.draw(x, y, context, state.currentColor);
    } else if (state.currentTool === "eraser" && this.currentCommand) {
      this.erase(x, y, context);
    } else if (this.isMoveMode && this.selectedObject) {
      const moveCommand = new MoveCommand(this.selectedObject, x, y);
      CommandHistory.executeCommand(moveCommand);
      store.dispatch(updateCanvas());
      console.log(`Object moved to: (${x}, ${y})`);
    }
  }

  handleMouseUp(e, canvas) {
    const state = store.getState();
    store.dispatch(stopDrawing());
    const context = canvas.getContext("2d");
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
      document.body.style.cursor = "default";
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
    const obj = { tool: "pencil", x, y, color };
    this.currentCommand.addPoint(obj);
    store.dispatch(addObject(obj));
    console.log(`Pencil drawing at: (${x}, ${y})`);
  }

  erase(x, y, context) {
    const obj = { tool: "eraser", x, y };
    this.currentCommand.addPoint(obj);
    context.clearRect(x - 10, y - 10, 20, 20);
    store.dispatch(removeObject(obj));
  }

  drawShape(x, y, context, tool, color) {
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.fillStyle = color; // 도형을 채우기 위해 추가

    if (tool === "circle") {
      context.beginPath();
      context.arc(x, y, 20, 0, 2 * Math.PI);
      context.fill(); // 도형을 채우기 위해 추가
      context.stroke();
    } else if (tool === "rectangle") {
      context.beginPath();
      context.rect(x - 20, y - 20, 40, 40);
      context.fill(); // 도형을 채우기 위해 추가
      context.stroke();
    } else if (tool === "triangle") {
      context.beginPath();
      context.moveTo(x, y - 20);
      context.lineTo(x - 20, y + 20);
      context.lineTo(x + 20, y + 20);
      context.closePath();
      context.fill(); // 도형을 채우기 위해 추가
      context.stroke();
    }
  }

  clearCanvas(canvas) {
    store.dispatch(clearCanvasAction());
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    GraphicModel.clearObjects();
    CommandHistory.clearHistory();
  }
}

const instance = new CanvasController();
export default instance;
