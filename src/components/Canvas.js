import React, { useRef, useEffect } from 'react';
import { useCanvasHandlers } from '../hooks/useCanvasHandlers';
import { useCanvasWebSocket } from '../hooks/useCanvasWebSocket';
import './Canvas.css';

const Canvas = React.forwardRef(({
  socket,
  brushColor,
  brushSize,
  brushStyle,
  currentShape,
  setBrushStyle,
  setBrushColor,
  setBrushSize,
  setCurrentShape,
  drawnShapes,
  setDrawnShapes
}, ref) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (ref) {
      ref.current = canvasRef.current;
    }
  }, [ref]);

  useCanvasWebSocket(
    socket,
    canvasRef,
    setBrushColor,
    setBrushSize,
    setBrushStyle,
    setCurrentShape,
    setDrawnShapes
  );

  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave,
  } = useCanvasHandlers(
    socket,
    canvasRef,
    brushColor,
    brushSize,
    brushStyle,
    currentShape,
    drawnShapes,
    setDrawnShapes
  );

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="canvas"
    />
  );
});

export default Canvas;