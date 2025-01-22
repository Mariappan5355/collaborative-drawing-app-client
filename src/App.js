import React, { useState, useRef } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import StatusBar from "./components/StatusBar"; 
import useWebSocket from "./hooks/useWebSocket";
import { Toaster, toast } from 'sonner';
import './App.css';

const Loader = () => (
  <div className="loader-container">
    <div className="rotating-cube">
      <div className="cube cube1"></div>
      <div className="cube cube2"></div>
      <div className="cube cube3"></div>
      <div className="cube cube4"></div>
    </div>
    <p className="loader-text">Connecting to server, please wait...</p>
  </div>
);




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
        socket.send(JSON.stringify({ type: 'clear' }));
        toast.success('Canvas cleared');
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
      toast.success('Drawing downloaded successfully');
    }
  };

  if (connectionStatus === 'connecting') {
    return <Loader />;
  }

  if (connectionStatus === 'disconnected') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <p className="text-lg text-red-600 font-medium">
            Disconnected from server...
          </p>
          <p className="text-sm text-red-500 mt-2">
            Attempting to reconnect ({socket ? socket.reconnectAttempts : 0}/5)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Toaster 
        position="top-right"
        expand
        richColors
        closeButton
      />
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