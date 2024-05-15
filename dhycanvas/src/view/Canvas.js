// src/components/Canvas.js
import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCanvas } from "../redux/actions";
import CanvasController from "../controller/CanvasController";

function Canvas() {
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const shouldClearCanvas = useSelector((state) => state.shouldClearCanvas);

  useEffect(() => {
    const canvas = canvasRef.current;

    const handleMouseDown = (e) => CanvasController.handleMouseDown(e, canvas);
    const handleMouseMove = (e) => CanvasController.handleMouseMove(e, canvas);
    const handleMouseUp = () => CanvasController.handleMouseUp(canvas);

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseout", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseout", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (shouldClearCanvas) {
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      dispatch({ type: "RESET_CLEAR_CANVAS" }); // Reset the shouldClearCanvas state
    }
  }, [shouldClearCanvas, dispatch]);

  const handleSave = (withBackground) => {
    const canvas = canvasRef.current;
    if (withBackground) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempContext = tempCanvas.getContext("2d");
      tempContext.fillStyle = "#ffffff";
      tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempContext.drawImage(canvas, 0, 0);
      const link = document.createElement("a");
      link.href = tempCanvas.toDataURL("image/png");
      link.download = "canvas_image_with_background.png";
      link.click();
    } else {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "canvas_image.png";
      link.click();
    }
  };

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} width={800} height={600}></canvas>
      <button className="save-button" onClick={() => handleSave(false)}>
        Save
      </button>
      <button className="save-button" onClick={() => handleSave(true)}>
        Save with Background
      </button>
    </div>
  );
}

export default Canvas;
