// command/SelectCommand.js
import { Command } from "./Command";
import GraphicModel from "../model/GraphicModel";

export class SelectCommand extends Command {
  constructor(object) {
    super();
    this.object = object;
    this.previousSelection = null;
  }

  execute() {
    this.previousSelection = GraphicModel.selectedObject;
    GraphicModel.selectedObject = this.object;
  }

  undo() {
    GraphicModel.selectedObject = this.previousSelection;
  }
}
