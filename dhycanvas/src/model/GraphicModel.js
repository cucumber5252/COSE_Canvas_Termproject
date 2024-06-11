/////model/GraphicModel.js////
import store from '../redux/store'; // Import the store
import { addObject, removeObject } from '../redux/actions'; // Import the actions

class GraphicModel {
    constructor() {
        if (!GraphicModel.instance) {
            this.objects = [];
            this.observers = [];
            this.currentTool = 'none';
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
        this.notifyObservers();
    }

    addObject(obj) {
        if (!this.objects.includes(obj)) {
            this.objects.push(obj);
            this.notifyObservers();
        }
    }

    removeObject(obj) {
        this.objects = this.objects.filter((o) => o !== obj);
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

    getObjects() {
        return [...this.objects]; // Return a copy of the objects array
    }
}

const instance = new GraphicModel();
export default instance;
