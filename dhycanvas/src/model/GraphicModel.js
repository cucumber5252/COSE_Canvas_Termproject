// GraphicModel.js
import store from '../redux/store';
import { addObject, removeObject } from '../redux/actions';

class GraphicModel {
    constructor() {
        if (!GraphicModel.instance) {
            this.objects = [];
            this.observers = [];
            this.currentTool = 'none';
            this.selectedObject = null;
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
        this.objects.push(obj);
        store.dispatch(addObject(obj));
        this.notifyObservers();
    }

    removeObject(obj) {
        this.objects = this.objects.filter((o) => o !== obj);
        store.dispatch(removeObject(obj));
        this.notifyObservers();
    }

    updateObjectPosition(obj, newX, newY) {
        const index = this.objects.findIndex((o) => o === obj);
        if (index !== -1) {
            this.objects[index].x = newX;
            this.objects[index].y = newY;
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
