// command/SelectCommand.js
import { Command } from './Command';
import GraphicModel from '../model/GraphicModel';

export class SelectCommand extends Command {
    constructor(object) {
        super();
        this.object = object;
        this.previousSelection = null;
    }

    execute() {
        this.previousSelection = GraphicModel.selectedObject;
        if (this.previousSelection) {
            this.previousSelection.isSelected = false;
        }
        GraphicModel.selectedObject = this.object;
        this.object.isSelected = true;
    }

    undo() {
        this.object.isSelected = false;
        if (this.previousSelection) {
            this.previousSelection.isSelected = true;
        }
        GraphicModel.selectedObject = this.previousSelection;
    }
}
