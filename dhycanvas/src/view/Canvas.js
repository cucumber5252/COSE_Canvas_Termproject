// view/Canvas.js
import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CanvasController from '../controller/CanvasController';
import { resetClearCanvas, resetUpdateCanvas } from '../redux/actions';

function Canvas() {
    const canvasRef = useRef(null);
    const dispatch = useDispatch();
    const shouldClearCanvas = useSelector((state) => state.shouldClearCanvas);
    const shouldUpdateCanvas = useSelector((state) => state.shouldUpdateCanvas);

    useEffect(() => {
        const canvas = canvasRef.current;
        CanvasController.setCanvas(canvas);

        const handleMouseDown = (e) => CanvasController.handleMouseDown(e);
        const handleMouseMove = (e) => CanvasController.handleMouseMove(e);
        const handleMouseUp = (e) => CanvasController.handleMouseUp(e);

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseout', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mouseout', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        if (shouldClearCanvas) {
            CanvasController.clearCanvas();
            dispatch(resetClearCanvas());
        }

        if (shouldUpdateCanvas) {
            CanvasController.update();
            dispatch(resetUpdateCanvas());
        }
    }, [shouldClearCanvas, shouldUpdateCanvas, dispatch]);

    const handleSave = (withBackground) => {
        const canvas = canvasRef.current;
        if (withBackground) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempContext = tempCanvas.getContext('2d');
            tempContext.fillStyle = '#ffffff';
            tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempContext.drawImage(canvas, 0, 0);
            const link = document.createElement('a');
            link.href = tempCanvas.toDataURL('image/png');
            link.download = 'canvas_image_with_background.png';
            link.click();
        } else {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'canvas_image.png';
            link.click();
        }
    };

    return (
        <div className="canvas-container">
            <canvas ref={canvasRef} width={900} height={600}></canvas>
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
