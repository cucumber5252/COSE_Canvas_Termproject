// src/components/Toolbar.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTool, clearCanvas, setColor } from '../redux/actions';
import ColorPicker from './ColorPicker';
import ToolbarController from '../controller/ToolbarController';

function Toolbar() {
    const [tool, setToolState] = useState('none');
    const [color, setColorState] = useState('#000000');
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const dispatch = useDispatch();

    const handleToolChange = (newTool) => {
        setToolState(newTool);
        dispatch(setTool(newTool));
    };

    const handleColorChange = (color) => {
        setColorState(color.hex);
        dispatch(setColor(color.hex));
    };

    const handleColorPickerClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleColorPickerClose = () => {
        setDisplayColorPicker(false);
    };

    const handleUndo = () => {
        ToolbarController.undo();
    };

    const handleRedo = () => {
        ToolbarController.redo();
    };

    return (
        <div className="toolbar">
            <button onClick={() => handleToolChange(tool === 'pencil' ? 'none' : 'pencil')}>
                {tool === 'pencil' ? 'Stop Drawing' : 'Pencil'}
            </button>
            <button onClick={() => handleToolChange(tool === 'circle' ? 'none' : 'circle')}>
                {tool === 'circle' ? 'Stop Drawing' : 'Circle'}
            </button>
            <button onClick={() => handleToolChange(tool === 'rectangle' ? 'none' : 'rectangle')}>
                {tool === 'rectangle' ? 'Stop Drawing' : 'Rectangle'}
            </button>
            <button onClick={() => handleToolChange(tool === 'triangle' ? 'none' : 'triangle')}>
                {tool === 'triangle' ? 'Stop Drawing' : 'Triangle'}
            </button>
            <button onClick={() => handleToolChange(tool === 'eraser' ? 'none' : 'eraser')}>
                {tool === 'eraser' ? 'Stop Erasing' : 'Eraser'}
            </button>
            <button onClick={handleColorPickerClick}>{displayColorPicker ? 'Close Color Picker' : 'Color'}</button>
            {displayColorPicker ? (
                <div className="color-picker">
                    <div className="color-picker-cover" onClick={handleColorPickerClose} />
                    <ColorPicker color={color} onChangeComplete={handleColorChange} />
                </div>
            ) : null}
            <button onClick={handleUndo}>Undo</button>
            <button onClick={handleRedo}>Redo</button>
            <button
                onClick={() => {
                    handleToolChange('none');
                    dispatch(clearCanvas());
                }}
            >
                Clear Canvas
            </button>
        </div>
    );
}

export default Toolbar;
