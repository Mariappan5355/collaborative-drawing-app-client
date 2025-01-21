import React, { useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";


const App = () => {
  const [socket, setSocket] = useState(null);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const wsURL = process.env.REACT_APP_WEBSOCKET_URL
    if (!wsURL) {
      console.error("WebSocket URL is not defined in the .env file");
      return;
    }
    const ws = new WebSocket(wsURL);

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    setSocket(ws);

    return () => {
      console.log("Cleaning up WebSocket connection");
      ws.onclose = null;
      ws.onmessage = null;
      ws.close();
    };
  }, []);

  if (!socket) {
    return <div>Connecting to server...</div>; // Placeholder while socket initializes
  }

  return (
    <div>
      <Toolbar
        setBrushColor={setBrushColor}
        setBrushSize={setBrushSize}
        socket={socket}
        brushColor={brushColor}
        brushSize={brushSize}
      />
      <Canvas
        socket={socket}
        brushColor={brushColor}
        brushSize={brushSize}
        setBrushColor={setBrushColor}
        setBrushSize={setBrushSize}
      />
    </div>
  );
};

export default App;
