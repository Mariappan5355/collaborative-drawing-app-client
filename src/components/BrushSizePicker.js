import React from 'react';

const BrushSizePicker = ({ setBrushSize }) => {
    const handleBrushSizeChange = (e) => setBrushSize(Number(e.target.value));

    return (
        <input
            type="range"
            min="1"
            max="50"
            defaultValue="5"
            onChange={handleBrushSizeChange}
            style={{ cursor: 'pointer' }}
        />
    );
};

export default BrushSizePicker;
