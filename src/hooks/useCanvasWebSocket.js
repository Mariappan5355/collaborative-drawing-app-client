import { useEffect } from 'react';
import { drawShape } from '../utils/DrawingUtils';

export const useCanvasWebSocket = (
  socket,
  canvasRef,
  setBrushColor,
  setBrushSize,
  setBrushStyle,
  setCurrentShape,
  setDrawnShapes
) => {
  useEffect(() => {
    if (!socket) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.putImageData(imageData, 0, 0);
    };

    const handleWebSocketMessage = async (event) => {
      try {
        const messageData = await event.data;
        const parsedData = JSON.parse(messageData);

        if (parsedData.type === 'clear') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          setDrawnShapes([]);
        } else if (parsedData.type === 'brushSettings') {
          setBrushColor(parsedData.color);
          setBrushSize(parsedData.size);
          setBrushStyle(parsedData.style);
          setCurrentShape(parsedData.currentShape);
        } else {
          drawShape(parsedData, ctx);
          setDrawnShapes(prev => [...prev, parsedData]);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };

    window.addEventListener('resize', handleResize);
    socket.onmessage = handleWebSocketMessage;

    return () => {
      window.removeEventListener('resize', handleResize);
      socket.onmessage = null;
    };
  }, [socket, setBrushColor, setBrushSize, setBrushStyle, setCurrentShape, setDrawnShapes]);
};