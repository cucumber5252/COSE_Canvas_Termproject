import React, { useRef, useEffect } from "react";
import GraphicModel from "../model/GraphicModel";

function Canvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineWidth = 5; // 선의 두께 설정
    let isDrawing = false;

    GraphicModel.addObserver({
      update: clearCanvas,
    });

    function clearCanvas() {
      if (GraphicModel.shouldClearCanvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        GraphicModel.clearAcknowledged();
      }
    }

    function draw(x, y) {
      if (!isDrawing) return;
      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
    }

    function erase(x, y) {
      if (!isDrawing) return;
      context.clearRect(x - 10, y - 10, 20, 20); // 지우개 크기 설정
    }

    const handleMouseDown = (e) => {
      isDrawing = true;
      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;
      context.beginPath();
      context.moveTo(x, y);
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;
      if (GraphicModel.currentTool === "pencil") {
        draw(x, y);
      } else if (GraphicModel.currentTool === "eraser") {
        erase(x, y);
      }
    };

    const handleMouseUp = () => {
      isDrawing = false;
      context.beginPath(); // 이 부분을 추가하여 드로잉 세션을 리셋합니다.
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseout", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseout", handleMouseUp);
      GraphicModel.removeObserver({ update: clearCanvas });
    };
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} style={{ border: "1px solid black" }}></canvas>;
}

export default Canvas;
