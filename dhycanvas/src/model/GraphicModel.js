class GraphicModel {
  constructor() {
    if (!GraphicModel.instance) {
      this.objects = [];
      this.observers = []; // 관찰자 리스트 초기화
      GraphicModel.instance = this;
    }
    return GraphicModel.instance;
  }

  addObject(obj) {
    this.objects.push(obj);
    this.notifyObservers();
  }

  removeObject(obj) {
    this.objects = this.objects.filter((o) => o !== obj);
    this.notifyObservers();
  }

  clearObjects() {
    this.objects = [];
    this.notifyObservers();
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

const instance = new GraphicModel();
// Object.freeze(instance);  // 이 부분을 주석 처리하거나 제거합니다.
export default instance;
