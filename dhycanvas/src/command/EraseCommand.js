/// command/EraseCommand.js
import { Command } from './Command';
import GraphicModel from '../model/GraphicModel';

export class EraseCommand extends Command {
    constructor() {
        super();
        this.objects = [];
    }

    addPoint(object) {
        this.objects.push(object);
    }

    execute() {
        this.objects.forEach((object) => GraphicModel.addObject(object));
    }

    undo() {
        this.objects.forEach((object) => GraphicModel.removeObject(object));
    }
}
