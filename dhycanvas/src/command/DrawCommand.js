////command/DrawCommand.js////
import { Command } from './Command';
import GraphicModel from '../model/GraphicModel';

export class DrawCommand extends Command {
    constructor(object) {
        super();
        this.object = object;
    }

    execute() {
        GraphicModel.addObject(this.object);
    }

    undo() {
        GraphicModel.removeObject(this.object);
    }
}
