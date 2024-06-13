// MoveCommand.js
import { Command } from "./Command";
import GraphicModel from "../model/GraphicModel";

export class MoveCommand extends Command {
  constructor(object, newX, newY) {
    super();
    this.object = object;
    //객체의 원래 위치 저장
    this.oldPositions = this.object.points
      ? this.object.points.map((point) => ({ x: point.x, y: point.y }))
      : [{ x: object.x, y: object.y }];
    //중심 위치 계산
    this.oldX = object.points ? this.calculateCenter().x : object.x;
    this.oldY = object.points ? this.calculateCenter().y : object.y;
    //객체의 새 위치 저장
    this.newX = newX;
    this.newY = newY;
    this.deltaX = newX - (this.oldPositions[0] ? this.oldPositions[0].x : object.x);
    this.deltaY = newY - (this.oldPositions[0] ? this.oldPositions[0].y : object.y);
  }

  calculateCenter() {
    const xSum = this.object.points.reduce((sum, point) => sum + point.x, 0);
    const ySum = this.object.points.reduce((sum, point) => sum + point.y, 0);
    return {
      x: xSum / this.object.points.length,
      y: ySum / this.object.points.length,
    };
  }

  execute() {
    if (this.object.points) {
      this.object.points.forEach((point) => {
        point.x += this.deltaX;
        point.y += this.deltaY;
      });
    } else {
      this.object.x += this.deltaX;
      this.object.y += this.deltaY;
    }
    GraphicModel.notifyObservers();
  }

  undo() {
    //실행 취소하여 원래 위치를 다시 실제 위치로 넣기.
    if (this.object.points) {
      this.object.points.forEach((point, index) => {
        point.x = this.oldPositions[index].x;
        point.y = this.oldPositions[index].y;
      });
    } else {
      this.object.x = this.oldPositions[0].x;
      this.object.y = this.oldPositions[0].y;
    }
    GraphicModel.notifyObservers();
  }
}
