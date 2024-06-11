import { Command } from './Command';
import GraphicModel from '../model/GraphicModel';

export class MoveCommand extends Command {
    constructor(object, newX, newY) {
        super();
        this.object = object;
        this.oldX = object.x;
        this.oldY = object.y;
        this.newX = newX;
        this.newY = newY;
    }

    execute() {
        GraphicModel.updateObjectPosition(this.object, this.newX, this.newY);
    }

    undo() {
        GraphicModel.updateObjectPosition(this.object, this.oldX, this.oldY);
    }
}
