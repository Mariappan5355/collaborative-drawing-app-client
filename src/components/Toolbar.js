import React from 'react';

const Toolbar = ({ setBrushColor, setBrushSize, socket, brushColor, brushSize }) => {
    const handleColorChange = (e) => {
        const newColor = e.target.value;
        setBrushColor(newColor);
        socket.send(JSON.stringify({
            type: 'brushSettings',
            color: newColor,
            size: brushSize,
        }));
    };

    const handleSizeChange = (e) => {
        const newSize = e.target.value;
        setBrushSize(newSize);
        socket.send(JSON.stringify({
            type: 'brushSettings',
            color: brushColor,
            size: newSize,
        }));
    };

    return (
        <div>
            <input type="color" value={brushColor} onChange={handleColorChange} />
            <input type="range" min="1" max="50" value={brushSize} onChange={handleSizeChange} />
        </div>
    );
};

export default Toolbar;
