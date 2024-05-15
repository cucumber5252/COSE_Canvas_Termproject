import React, { useState } from "react";
import GraphicModel from "../model/GraphicModel";

function Toolbar() {
  const [tool, setTool] = useState("none"); // 현재 사용 중인 도구

  const handleToolChange = (newTool) => {
    setTool(newTool);
    GraphicModel.setTool(newTool);
  };

  return (
    <div>
      <button onClick={() => handleToolChange(tool === "pencil" ? "none" : "pencil")}>
        {tool === "pencil" ? "Stop Drawing" : "Pencil"}
      </button>
      <button onClick={() => handleToolChange(tool === "eraser" ? "none" : "eraser")}>
        {tool === "eraser" ? "Stop Erasing" : "Eraser"}
      </button>
      <button
        onClick={() => {
          handleToolChange("none");
          GraphicModel.clearObjects();
        }}
      >
        Clear Canvas
      </button>
    </div>
  );
}

export default Toolbar;
