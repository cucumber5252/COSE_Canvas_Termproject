// view/Canvas.js
import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CanvasController from '../controller/CanvasController';
import GraphicModel from '../model/GraphicModel';
import { resetClearCanvas, resetUpdateCanvas } from '../redux/actions';

function Canvas() {
    const canvasRef = useRef(null);
    const dispatch = useDispatch();
    const shouldClearCanvas = useSelector((state) => state.shouldClearCanvas);
    const shouldUpdateCanvas = useSelector((state) => state.shouldUpdateCanvas);

    useEffect(() => {
        const canvas = canvasRef.current;

        const handleMouseDown = (e) => CanvasController.handleMouseDown(e, canvas);
        const handleMouseMove = (e) => CanvasController.handleMouseMove(e, canvas);
        const handleMouseUp = (e) => CanvasController.handleMouseUp(e, canvas);

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
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (shouldClearCanvas) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            GraphicModel.clearObjects();
            dispatch(resetClearCanvas());
        }

        if (shouldUpdateCanvas) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            GraphicModel.objects.forEach((obj) => {
                context.strokeStyle = obj.color;
                context.fillStyle = obj.color;
                context.lineWidth = 2;

                if (obj.tool === 'pencil') {
                    context.beginPath();
                    context.moveTo(obj.x, obj.y);
                    context.lineTo(obj.x, obj.y);
                    context.stroke();
                } else if (obj.tool === 'eraser') {
                    context.clearRect(obj.x - 10, obj.y - 10, 20, 20);
                } else if (obj.tool === 'circle') {
                    context.beginPath();
                    context.arc(obj.x, obj.y, 20, 0, 2 * Math.PI);
                    context.fill();
                    context.stroke();
                } else if (obj.tool === 'rectangle') {
                    context.beginPath();
                    context.rect(obj.x - 20, obj.y - 20, 40, 40);
                    context.fill();
                    context.stroke();
                } else if (obj.tool === 'triangle') {
                    context.beginPath();
                    context.moveTo(obj.x, obj.y - 20);
                    context.lineTo(obj.x - 20, obj.y + 20);
                    context.lineTo(obj.x + 20, obj.y + 20);
                    context.closePath();
                    context.fill();
                    context.stroke();
                }

                if (obj === GraphicModel.selectedObject) {
                    context.strokeStyle = 'blue';
                    context.lineWidth = 4;
                    context.strokeRect(obj.x - 25, obj.y - 25, 50, 50);
                }
            });
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
