import React, { useRef, useEffect } from "react";
import GraphicModel from "../model/GraphicModel";

function Canvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    GraphicModel.addObserver({
      update: draw,
    });

    function draw() {
      if (!context) return; // context가 초기화되지 않았다면 그리지 않음
      context.clearRect(0, 0, canvas.width, canvas.height);
      GraphicModel.objects.forEach((obj) => obj.draw(context));
    }

    draw();
    return () => GraphicModel.removeObserver(draw);
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} style={{ border: "1px solid black" }}></canvas>;
}

export default Canvas;
