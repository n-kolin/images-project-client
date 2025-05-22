export const clearCanvas = (canvas: HTMLCanvasElement) => {
    if (!canvas) {
      console.error('Canvas element is not provided.');
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context for the canvas.');
      return;
    }
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  
  export const drawImage = (
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    options?: { maintainAspectRatio?: boolean; offsetX?: number; offsetY?: number }
  ) => {
    if (!canvas || !image) {
      console.error('Canvas or image element is not provided.');
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context for the canvas.');
      return;
    }
  
    const { maintainAspectRatio = true, offsetX = 0, offsetY = 0 } = options || {};
    if (maintainAspectRatio) {
      const imageAspectRatio = image.width / image.height;
      const canvasAspectRatio = canvas.width / canvas.height;
  
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
  
      if (imageAspectRatio > canvasAspectRatio) {
        drawHeight = canvas.width / imageAspectRatio;
      } else {
        drawWidth = canvas.height * imageAspectRatio;
      }
  
      const x = offsetX + (canvas.width - drawWidth) / 2;
      const y = offsetY + (canvas.height - drawHeight) / 2;
  
      ctx.drawImage(image, x, y, drawWidth, drawHeight);
    } else {
      ctx.drawImage(image, offsetX, offsetY, canvas.width, canvas.height);
    }
  };
  
  export const applyFilter = (canvas: HTMLCanvasElement, filter: string) => {
    if (!canvas) {
      console.error('Canvas element is not provided.');
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context for the canvas.');
      return;
    }
  
    // Validate the filter string
    const validFilters = ['blur', 'brightness', 'contrast', 'grayscale', 'hue-rotate', 'invert', 'opacity', 'saturate', 'sepia', 'none'];
    const isValidFilter = validFilters.some((validFilter) => filter.startsWith(validFilter));
  
    if (!isValidFilter) {
      console.error(`Invalid filter: "${filter}". Please provide a valid CSS filter.`);
      return;
    }
  
    ctx.filter = filter;
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
  
    // Reset the filter to ensure it doesn't affect subsequent drawings
    ctx.filter = 'none';
  };