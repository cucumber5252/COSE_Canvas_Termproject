////command/ClearCommand.js////
import { Command } from './Command';
import GraphicModel from '../model/GraphicModel';

export class ClearCommand extends Command {
    constructor(objects) {
        super();
        this.objects = [...objects]; // Save a copy of all objects before clearing
    }

    execute() {
        GraphicModel.clearObjects(); // Clear all objects from the model
    }

    undo() {
        this.objects.forEach((obj) => GraphicModel.addObject(obj)); // Restore all objects
    }
}
