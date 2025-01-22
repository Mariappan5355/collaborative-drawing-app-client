import React from 'react';
import {  Square, Circle, Minus, Download, Trash2 } from 'lucide-react';
import './Toolbar.css';

const Toolbar = ({
  setBrushColor,
  setBrushSize,
  setBrushStyle,
  setCurrentShape,
  socket,
  brushColor,
  brushSize,
  brushStyle,
  currentShape,
  onClear,
  onDownload
}) => {
  const shapes = [
    { id: 'freehand', icon: <Minus className="w-4 h-4" />, label: 'Freehand' },
    { id: 'square', icon: <Square className="w-4 h-4" />, label: 'Square' },
    { id: 'circle', icon: <Circle className="w-4 h-4" />, label: 'Circle' }
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ];

  const brushSizes = [2, 5, 10, 15, 20];
  const brushStyles = ['solid', 'dashed', 'dotted'];

  const sendBrushSettings = (color, size, style, currentShape) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'brushSettings',
        color,
        size,
        style,
        currentShape
      }));
    }
  };

  const handleColorChange = (color) => {
    setBrushColor(color);
    sendBrushSettings(color, brushSize, brushStyle, currentShape);
  };

  const handleSizeChange = (size) => {
    setBrushSize(size);
    sendBrushSettings(brushColor, size, brushStyle, currentShape);
  };

  const handleStyleChange = (style) => {
    setBrushStyle(style);
    sendBrushSettings(brushColor, brushSize, style, currentShape);
  };

  const handleShapeChange = (shape) => {
    setCurrentShape(shape);
    sendBrushSettings(brushColor, brushSize, brushStyle, shape);
  };

  return (
    <div className="toolbar">
      {/* Tools Section */}
      <div className="toolbar-section">
        <h3 className="toolbar-section-title">Tools</h3>
        <div className="tools-container">
          {shapes.map(shape => (
            <button
              key={shape.id}
              className={`tool-button ${currentShape === shape.id ? 'active' : ''}`}
              title={shape.label}
              onClick={() => handleShapeChange(shape.id)}
            >
              {shape.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div className="toolbar-section">
        <h3 className="toolbar-section-title">Colors</h3>
        <div className="colors-container">
          {colors.map(color => (
            <button
              key={color}
              className={`color-button ${brushColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
              title={color}
            />
          ))}
          <input
            type="color"
            value={brushColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="custom-color-input"
            title="Custom color"
          />
        </div>
      </div>

      {/* Brush Size */}
      <div className="toolbar-section">
        <h3 className="toolbar-section-title">Brush Size</h3>
        <div className="brush-sizes-container">
          {brushSizes.map(size => (
            <button
              key={size}
              className={`size-button ${brushSize === size ? 'active' : ''}`}
              onClick={() => handleSizeChange(size)}
            >
              <div
                className="size-preview"
                style={{
                  width: size,
                  height: size,
                  transform: 'scale(0.8)'
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Brush Style */}
      <div className="toolbar-section">
        <h3 className="toolbar-section-title">Brush Style</h3>
        <div className="brush-styles-container">
          {brushStyles.map(style => (
            <button
              key={style}
              className={`style-button ${brushStyle === style ? 'active' : ''}`}
              onClick={() => handleStyleChange(style)}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="toolbar-section">
        <h3 className="toolbar-section-title">Actions</h3>
        <div className="actions-container">
          <button
            className="action-button"
            title="Clear Canvas"
            onClick={onClear}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            className="action-button"
            title="Download"
            onClick={onDownload}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;