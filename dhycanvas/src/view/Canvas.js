// src/components/Canvas.js
import React, { useRef, useEffect } from "react";
//Redux 훅 가져옴
import { useSelector, useDispatch } from "react-redux";
import { clearCanvas } from "../redux/actions";

import CanvasController from "../controller/CanvasController";

function Canvas() {
  //캔버스 요소에 대한 참조 생성
  const canvasRef = useRef(null);
  //Redux 디스패치 함수 얻음 : action을 store에 전달할 수 있도록 함.
  const dispatch = useDispatch();
  //Redux 상태에서 sholdClearCanvas 값을 가져옴
  const shouldClearCanvas = useSelector((state) => state.shouldClearCanvas);

  useEffect(() => {
    const canvas = canvasRef.current;

    //마우스 이벤트 핸들러 설정
    const handleMouseDown = (e) => CanvasController.handleMouseDown(e, canvas);
    const handleMouseMove = (e) => CanvasController.handleMouseMove(e, canvas);
    const handleMouseUp = () => CanvasController.handleMouseUp(canvas);

    //이벤트 리스너 설정
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseout", handleMouseUp);
    
    //컴포넌트가 언마운트될 때 이벤트 리스너를 제거
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
