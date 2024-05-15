import GraphicModel from '../model/GraphicModel';

class ToolbarController {
    setTool(tool) {
        GraphicModel.setTool(tool);
    }

    clearCanvas() {
        GraphicModel.clearObjects();
    }
}

export default new ToolbarController();
