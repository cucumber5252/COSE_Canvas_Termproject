import React from 'react';
import { SketchPicker } from 'react-color';

const ColorPicker = ({ color = '#000', onChangeComplete = () => {} }) => {
    return <SketchPicker color={color} onChangeComplete={onChangeComplete} />;
};

export default ColorPicker;
