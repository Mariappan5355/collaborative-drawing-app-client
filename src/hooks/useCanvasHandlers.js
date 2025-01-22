import { useRef, useState } from 'react';
import { throttle } from 'lodash';
import { drawShape, drawPreview } from '../utils/DrawingUtils'

export const useCanvasHandlers = (
  socket,
  canvasRef,
  brushColor,
  brushSize,
  brushStyle,
  currentShape,
  drawnShapes,
  setDrawnShapes
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState(null);
  const [startPos, setStartPos] = useState(null);

  const throttledSend = useRef(
    throttle((data) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
      }
    }, 16)
  ).current;

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = { x: e.clientX, y: e.clientY };
    setLastPos(pos);
    setStartPos(pos);
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      const data = {
        startX: startPos.x,
        startY: startPos.y,
        endX: lastPos.x,
        endY: lastPos.y,
        color: brushColor,
        size: brushSize,
        style: brushStyle,
        shape: currentShape,
        timestamp: Date.now(),
      };

      throttledSend(data);
      setDrawnShapes(prev => [...prev, data]);
    }
    
    setIsDrawing(false);
    setLastPos(null);
    setStartPos(null);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const pos = { x: e.clientX, y: e.clientY };
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw all previously drawn shapes
    drawnShapes.forEach(shape => drawShape(shape, ctx));

    // Draw preview of current shape
    drawPreview(ctx, startPos, pos, brushColor, brushSize, brushStyle, currentShape);

    setLastPos(pos);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
    setLastPos(null);
    setStartPos(null);
  };

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave,
  };
};