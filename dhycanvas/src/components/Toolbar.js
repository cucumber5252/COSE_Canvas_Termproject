import React from "react";
import GraphicModel from "../model/GraphicModel";
import ShapeFactory from "../factory/ShapeFactory";

function Toolbar() {
  const handleDraw = () => {
    const shape = ShapeFactory.createShape("circle", { x: 100, y: 100, radius: 50 });
    GraphicModel.addObject(shape);
  };

  const handleErase = () => {
    // 이 예제에서는 마지막 추가된 객체를 지우는 로직을 사용합니다.
    GraphicModel.objects.length > 0 && GraphicModel.removeObject(GraphicModel.objects[GraphicModel.objects.length - 1]);
  };

  const handleClear = () => {
    GraphicModel.clearObjects();
  };

  return (
    <div>
      <button onClick={handleDraw}>Draw Circle</button>
      <button onClick={handleErase}>Erase Last Object</button>
      <button onClick={handleClear}>Clear Canvas</button>
    </div>
  );
}

export default Toolbar;
