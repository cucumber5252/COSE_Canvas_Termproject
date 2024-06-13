// command/SelectCommand.js
import { Command } from "./Command";
import GraphicModel from "../model/GraphicModel";

export class SelectCommand extends Command {
  constructor(object) {
    super();
    this.object = object; //선택할 객체 저장
    this.previousSelection = null; // 이전에 선택된 객체를 저장
  }

  execute() {
    //이 객체가 선택된 객체인지 판단
    this.previousSelection = GraphicModel.selectedObject;
    //선택 되었다면
    if (this.previousSelection) {
      this.previousSelection.isSelected = false; //선택 취소
    }
    //아니라면 선택
    GraphicModel.selectedObject = this.object;
    this.object.isSelected = true;
  }

  undo() {
    //선택을 취소
    this.object.isSelected = false;
    //이미 선택됐던애라면 취소하기
    if (this.previousSelection) {
      this.previousSelection.isSelected = true;
    }
    GraphicModel.selectedObject = this.previousSelection;
  }
}
