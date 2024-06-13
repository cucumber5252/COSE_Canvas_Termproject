// command/DrawCommand.js
import { Command } from "./Command";
import GraphicModel from "../model/GraphicModel";
import { PencilObject } from "../model/PencilObject";

export class DrawCommand extends Command {
  constructor() {
    super();
    //PencilObject 인스턴스 생성
    this.pencilObject = new PencilObject();
  }

  //그릴 점들을 모아주고
  addPoint(point) {
    this.pencilObject.addPoint(point);
  }

  execute() {
    GraphicModel.addObject(this.pencilObject);
  }

  undo() {
    GraphicModel.removeObject(this.pencilObject);
  }
}
