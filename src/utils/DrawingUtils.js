export const drawShape = ({ startX, startY, endX, endY, color, size, style, shape }, ctx) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.setLineDash(style === 'dashed' ? [5, 5] : style === 'dotted' ? [1, 5] : []);
    
    switch (shape) {
      case 'square':
        const width = endX - startX;
        const height = endY - startY;
        const size = Math.max(Math.abs(width), Math.abs(height));
        const offsetX = width < 0 ? startX - size : startX;
        const offsetY = height < 0 ? startY - size : startY;
        ctx.strokeRect(offsetX, offsetY, size, size);
        break;
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
        );
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      default:
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
  };
  
  export const drawPreview = (ctx, startPos, currentPos, brushColor, brushSize, brushStyle, currentShape) => {
    if (currentShape === 'circle') {
      const radius = Math.sqrt(
        Math.pow(currentPos.x - startPos.x, 2) + Math.pow(currentPos.y - startPos.y, 2)
      );
      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.setLineDash(brushStyle === 'dashed' ? [5, 5] : brushStyle === 'dotted' ? [1, 5] : []);
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (currentShape === 'square') {
      const width = currentPos.x - startPos.x;
      const height = currentPos.y - startPos.y;
      const size = Math.max(Math.abs(width), Math.abs(height));
      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.setLineDash(brushStyle === 'dashed' ? [5, 5] : brushStyle === 'dotted' ? [1, 5] : []);
      ctx.strokeRect(startPos.x, startPos.y, size, size);
    } else {
      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.setLineDash(brushStyle === 'dashed' ? [5, 5] : brushStyle === 'dotted' ? [1, 5] : []);
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(currentPos.x, currentPos.y);
      ctx.stroke();
    }
  };