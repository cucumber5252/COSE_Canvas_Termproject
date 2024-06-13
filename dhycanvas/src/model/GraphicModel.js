// GraphicModel.js
import store from "../redux/store";
import { addObject, removeObject } from "../redux/actions";

class GraphicModel {
  static instance;

  constructor() {
    if (GraphicModel.instance) {
      return GraphicModel.instance;
    }
    GraphicModel.instance = this;
    this.objects = []; //그래픽 객체들을 저장
    this.observers = [];
    this.currentTool = "none"; //현재 선택된 툴 저장
    this.selectedObject = null; //선택된 객체 저장
  }

  setTool(tool) {
    this.currentTool = tool;
    this.notifyObservers();
  }

  //모든 객체들 제거
  clearObjects() {
    this.objects = [];
    this.notifyObservers();
  }

  //객체 추가
  addObject(obj) {
    this.objects.push(obj);
    store.dispatch(addObject(obj));
    this.notifyObservers();
  }

  // 객체 제거
  removeObject(obj) {
    this.objects = this.objects.filter((o) => o !== obj);
    store.dispatch(removeObject(obj));
    this.notifyObservers();
  }
  //객체 위치 업데이트
  updateObjectPosition(obj, newX, newY) {
    if (obj.points) {
      const center = this.calculateCenter(obj);
      const deltaX = newX - obj.points[0].x;
      const deltaY = newY - obj.points[0].y;
      obj.points.forEach((point) => {
        point.x += deltaX;
        point.y += deltaY;
      });
    } else {
      obj.x = newX;
      obj.y = newY;
    }
    this.notifyObservers();
  }

  //객체 위치 업데이트 할 때도, 객체의 중심을 기준으로 이동 거리 계산
  calculateCenter(obj) {
    const xSum = obj.points.reduce((sum, point) => sum + point.x, 0);
    const ySum = obj.points.reduce((sum, point) => sum + point.y, 0);
    return {
      x: xSum / obj.points.length,
      y: ySum / obj.points.length,
    };
  }

  notifyObservers() {
    this.observers.forEach((observer) => observer.update());
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }
}

export default new GraphicModel();
