// Toolbar.js
import React, { useState } from 'react';
import ToolbarController from '../controller/ToolbarController';

function Toolbar() {
    const [tool, setTool] = useState('none');

    const handleToolChange = (newTool) => {
        setTool(newTool);
        ToolbarController.setTool(newTool);
    };

    return (
        <div>
            <button onClick={() => handleToolChange(tool === 'pencil' ? 'none' : 'pencil')}>
                {tool === 'pencil' ? 'Stop Drawing' : 'Pencil'}
            </button>
            <button onClick={() => handleToolChange(tool === 'eraser' ? 'none' : 'eraser')}>
                {tool === 'eraser' ? 'Stop Erasing' : 'Eraser'}
            </button>
            <button
                onClick={() => {
                    handleToolChange('none');
                    ToolbarController.clearCanvas();
                }}
            >
                Clear Canvas
            </button>
        </div>
    );
}

export default Toolbar;
