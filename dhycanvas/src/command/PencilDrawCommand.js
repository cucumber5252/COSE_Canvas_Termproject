// command/PencilDrawCommand.js
import { Command } from './Command';
import GraphicModel from '../model/GraphicModel';

export class PencilDrawCommand extends Command {
    constructor() {
        super();
        this.points = [];
    }

    addPoint(point) {
        this.points.push(point);
    }

    execute() {
        this.points.forEach((point) => GraphicModel.addObject(point));
    }

    undo() {
        this.points.forEach((point) => GraphicModel.removeObject(point));
    }
}
