class GraphicModel {
    constructor() {
        if (!GraphicModel.instance) {
            this.objects = [];
            this.observers = [];
            this.currentTool = 'none';
            this.shouldClearCanvas = false;
            GraphicModel.instance = this;
        }
        return GraphicModel.instance;
    }

    setTool(tool) {
        this.currentTool = tool;
        this.notifyObservers();
    }

    clearObjects() {
        this.objects = [];
        this.shouldClearCanvas = true;
        this.notifyObservers();
    }

    clearAcknowledged() {
        this.shouldClearCanvas = false;
    }

    addObject(obj) {
        if (this.currentTool === 'pencil') {
            this.objects.push(obj);
            this.notifyObservers();
        }
    }

    removeObject(obj) {
        if (this.currentTool === 'eraser') {
            this.objects = this.objects.filter((o) => o !== obj);
            this.notifyObservers();
        }
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
export default instance;
