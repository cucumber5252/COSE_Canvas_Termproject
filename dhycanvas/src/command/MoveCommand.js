// MoveCommand.js
import { Command } from "./Command";
import GraphicModel from "../model/GraphicModel";

export class MoveCommand extends Command {
  constructor(object, newX, newY) {
    super();
    this.object = { ...object }; // 객체의 복사본을 저장
    this.oldX = object.x;
    this.oldY = object.y;
    this.newX = newX;
    this.newY = newY;
  }

  execute() {
    this.object.x = this.newX;
    this.object.y = this.newY;
    GraphicModel.updateObjectPosition(this.object, this.newX, this.newY);
  }

  undo() {
    this.object.x = this.oldX;
    this.object.y = this.oldY;
    GraphicModel.updateObjectPosition(this.object, this.oldX, this.oldY);
  }
}
