import React from 'react';

const ColorPicker = ({ setBrushColor }) => {
    const handleColorChange = (e) => setBrushColor(e.target.value);

    return <input type="color" onChange={handleColorChange} style={{ cursor: 'pointer' }} />;
};

export default ColorPicker;
