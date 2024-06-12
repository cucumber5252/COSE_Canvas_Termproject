// command/DeleteCommand.js
import { Command } from "./Command";
import GraphicModel from "../model/GraphicModel";

export class DeleteCommand extends Command {
  constructor(object) {
    super();
    this.object = object;
  }

  execute() {
    GraphicModel.removeObject(this.object);
  }

  undo() {
    GraphicModel.addObject(this.object);
  }
}
