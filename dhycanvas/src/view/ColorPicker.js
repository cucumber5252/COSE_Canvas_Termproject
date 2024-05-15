// src/components/ColorPicker.js
import React from "react";
import { SketchPicker } from "react-color";

const ColorPicker = ({ color, onChangeComplete }) => {
  return <SketchPicker color={color} onChangeComplete={onChangeComplete} />;
};

ColorPicker.defaultProps = {
  color: "#000",
  onChangeComplete: () => {},
};

export default ColorPicker;
