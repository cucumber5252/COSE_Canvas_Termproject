// Canvas.js
import React, { useRef, useEffect } from 'react';
import GraphicModel from '../model/GraphicModel';
import CanvasController from '../controller/CanvasController';

function Canvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        GraphicModel.addObserver({
            update: () => CanvasController.clearCanvas(canvas),
        });

        const handleMouseDown = (e) => CanvasController.handleMouseDown(e, canvas);
        const handleMouseMove = (e) => CanvasController.handleMouseMove(e, canvas);
        const handleMouseUp = () => CanvasController.handleMouseUp(canvas);

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseout', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mouseout', handleMouseUp);
            GraphicModel.removeObserver({ update: () => CanvasController.clearCanvas(canvas) });
        };
    }, []);

    return <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid black' }}></canvas>;
}

export default Canvas;
