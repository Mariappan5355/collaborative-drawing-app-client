import React, { useRef, useEffect, useState } from 'react';
import { throttle } from 'lodash';

const Canvas = ({ socket, brushColor, brushSize, setBrushColor, setBrushSize }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState(null);

    useEffect(() => {
        if (!socket) return; 

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const draw = ({ startX, startY, endX, endY, color, size }) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        };

        // Set up WebSocket message handler
        socket.onmessage = async (event) => {
            try {
                const messageData = await event.data.text();
                const parsedData = JSON.parse(messageData);
                if (parsedData.type === 'brushSettings') {
                    setBrushColor(parsedData.color);
                    setBrushSize(parsedData.size);
                } else {
                    draw(parsedData);
                }
            } catch (error) {
                console.error('Error handling WebSocket message:', error);
            }
        };

        return () => {
            socket.onmessage = null; 
        };
    }, [socket, setBrushColor, setBrushSize]);

    const throttledSend = useRef(
        throttle((data) => {
            console.log(socket, data);
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(data));
            }
        }, 4)
    ).current;

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        setLastPos(null);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;

        const { x, y } = { x: e.clientX, y: e.clientY };
        if (!lastPos) return;

        const data = {
            startX: lastPos.x,
            startY: lastPos.y,
            endX: x,
            endY: y,
            color: brushColor,
            size: brushSize,
            timestamp: Date.now(),
        };

        throttledSend(data);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        setLastPos({ x, y });
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ border: '1px solid #ddd', display: 'block' }}
        />
    );
};

export default Canvas;
