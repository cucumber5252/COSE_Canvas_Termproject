import store from "../redux/store";
import { updateCanvas } from "../redux/actions";

// CommandHistory 클래스는 명령을 실행하고, 실행 취소 및 재실행을 관리합니다.

class CommandHistory {
  constructor() {
    this.history = []; // 실행된 명령의 기록을 저장합니다.
    this.redoStack = []; // 실행 취소된 명령을 재실행하기 위해 저장합니다.
  }

  // 명령 최초 실행 : 기록에 추가
  executeCommand(command) {
    command.execute();
    this.history.push(command);
    this.redoStack = [];
  }
  // undo 실행취소 : 마지막 명령 실행 취소
  undo() {
    const command = this.history.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
      store.dispatch(updateCanvas());
    }
  }
  // redo 재실행 : 실행 취소된 명령을 다시 실행합니다.
  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.history.push(command);
      store.dispatch(updateCanvas());
    }
  }

  //명령 기록 초기화
  clearHistory() {
    this.history = [];
    this.redoStack = [];
  }
}

const instance = new CommandHistory();
export default instance;
