import React, { useState, useRef } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import StatusBar from "./components/StatusBar"; 
import useWebSocket from "./hooks/useWebSocket";
import './App.css';
import { Toaster } from 'sonner';

const App = () => {
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [brushStyle, setBrushStyle] = useState("solid");
  const [currentShape, setCurrentShape] = useState("freehand");
  const [drawnShapes, setDrawnShapes] = useState([]);
  
  const { socket, connectionStatus, connectedUsers } = useWebSocket();
  const canvasRef = useRef(null);

  const handleClear = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      setDrawnShapes([]);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (socket) {
        socket.send(
          JSON.stringify({
            type: 'clear',
          })
        );
      }
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = `canvas-drawing-${Date.now()}.png`;
      a.click();
    }
  };

  if (connectionStatus === 'connecting') {
    return (
      <div className="connection-status">
        <div className="status-message">Connecting to server...</div>
      </div>
    );
  }

  if (connectionStatus === 'disconnected') {
    return (
      <div className="connection-status">
        <div className="status-message">
          Disconnected from server... 
          {`Attempting to reconnect (${socket ? socket.reconnectAttempts : 0}/5)`}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Toaster />
      <StatusBar 
        connectionStatus={connectionStatus} 
        connectedUsers={connectedUsers} 
      />
      <Toolbar
        setBrushColor={setBrushColor}
        setBrushSize={setBrushSize}
        setBrushStyle={setBrushStyle}
        setCurrentShape={setCurrentShape}
        socket={socket}
        brushColor={brushColor}
        brushSize={brushSize}
        brushStyle={brushStyle}
        currentShape={currentShape}
        onClear={handleClear}
        onDownload={handleDownload}
      />
      <Canvas
        ref={canvasRef}
        socket={socket}
        brushColor={brushColor}
        brushSize={brushSize}
        brushStyle={brushStyle}
        currentShape={currentShape}
        drawnShapes={drawnShapes}
        setDrawnShapes={setDrawnShapes}
      />
    </div>
  );
};

export default App;
