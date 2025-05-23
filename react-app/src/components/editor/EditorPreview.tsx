// import React, { useEffect, useRef } from 'react';
// import { useImageEditorContext } from '../../context/ImageEditorContext';

// const EditorPreview: React.FC = () => {
//   const { imageState } = useImageEditorContext();
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (canvas && ctx) {
//       // ניקוי הקנבס
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // ציור התמונה אם קיימת
//       if (imageState.imageData) {
//         const image = new Image();
//         image.src = imageState.imageData;
//         image.onload = () => {
//           ctx.save();

//           // החלת רוטציה אם קיימת
//           if (imageState.filters.rotation) {
//             const rotation = imageState.filters.rotation;
//             ctx.translate(canvas.width / 2, canvas.height / 2); // מרכז הציור
//             ctx.rotate((rotation * Math.PI) / 180); // רוטציה
//             ctx.translate(-canvas.width / 2, -canvas.height / 2); // שחזור
//           }

//           ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

//           // החלת שכבת טקסט אם קיימת
//           if (imageState.filters.textLayer) {
//             const { text, x, y, fontSize, color } = imageState.filters.textLayer;
//             ctx.font = `${fontSize}px Arial`;
//             ctx.fillStyle = color;
//             ctx.fillText(text, x, y);
//           }

//           ctx.restore(); // שחזור המצב של הקנבס
//         };
//       }
//     }
//   }, [imageState]);

//   return <canvas ref={canvasRef} width={500} height={500} />;
// };

// export default EditorPreview;




// components/ImageEditor/EditorPreview.tsx

// import React, { useEffect, useRef } from 'react';
// import { useImageEditorContext } from '../../context/ImageEditorContext';

// const EditorPreview: React.FC = () => {
//   const { imageState } = useImageEditorContext();
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);


//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (canvas && ctx) {
//       // Clear the canvas
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       // imageState.imageData = 'https://img.freepik.com/free-photo/bonifacio-lighthouse_181624-5126.jpg?uid=R150112249&ga=GA1.1.1129303057.1731009829&semt=ais_hybrid&w=740'

//       if (true) {
//         console.log("in preview", imageState);

//         const image = new Image();
//         // image.crossOrigin = "anonymous"; // Prevent CORS issues
//         // image.src = imageState.imageData;
//         // image.src = '../../../public/imgs/1.jpg';
//         image.src = 'http://img.freepik.com/free-photo/bonifacio-lighthouse_181624-5126.jpg?uid=R150112249&ga=GA1.1.1129303057.1731009829&semt=ais_hybrid&w=740'
//         image.onload = () => {
//           ctx.save();
//           console.log('*****************');

//           // Apply transformations if they exist
//           if (imageState.filters.transform) {
//             const { rotation = 0, scale = 1, flipX = false, flipY = false } = imageState.filters.transform;

//             ctx.translate(canvas.width / 2, canvas.height / 2);

//             if (rotation) {
//               ctx.rotate((rotation * Math.PI) / 180);
//             }

//             if (scale !== 1) {
//               ctx.scale(scale, scale);
//             }

//             if (flipX || flipY) {
//               ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
//             }

//             ctx.translate(-canvas.width / 2, -canvas.height / 2);
//           }

//           // Apply crop if it exists
//           if (imageState.filters.crop) {
//             const { x, y, width, height } = imageState.filters.crop;
//             ctx.drawImage(
//               image,
//               x, y, width, height, // source
//               0, 0, canvas.width, canvas.height // destination
//             );
//           } else {
//             ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
//           }

//           // Apply filters if they exist
//           if (imageState.filters.filter) {
//             const { brightness, contrast, saturation, blur, grayscale } = imageState.filters.filter;

//             let filterString = '';
//             if (brightness !== undefined) filterString += `brightness(${brightness}%) `;
//             if (contrast !== undefined) filterString += `contrast(${contrast}%) `;
//             if (saturation !== undefined) filterString += `saturate(${saturation}%) `;
//             if (blur !== undefined) filterString += `blur(${blur}px) `;
//             if (grayscale !== undefined) filterString += `grayscale(${grayscale}%) `;

//             if (filterString) {
//               ctx.filter = filterString;
//               ctx.drawImage(canvas, 0, 0);
//               ctx.filter = 'none';
//             }
//           }

//           // Add overlay if it exists
//           if (imageState.filters.overlay) {
//             const { color, blendMode } = imageState.filters.overlay;
//             ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;
//             ctx.fillStyle = color;
//             ctx.fillRect(0, 0, canvas.width, canvas.height);
//             ctx.globalCompositeOperation = 'source-over';
//           }

//           // Add border if it exists
//           if (imageState.filters.border) {
//             const { width, color, style } = imageState.filters.border;
//             ctx.strokeStyle = color;
//             ctx.lineWidth = width;

//             if (style === 'dashed') {
//               ctx.setLineDash([10, 5]);
//             } else if (style === 'dotted') {
//               ctx.setLineDash([2, 2]);
//             } else {
//               ctx.setLineDash([]);
//             }

//             ctx.strokeRect(width / 2, width / 2, canvas.width - width, canvas.height - width);
//           }

//           // Add shadow if it exists
//           if (imageState.filters.shadow) {
//             const { offsetX, offsetY, blur, color } = imageState.filters.shadow;
//             ctx.shadowOffsetX = offsetX;
//             ctx.shadowOffsetY = offsetY;
//             ctx.shadowBlur = blur;
//             ctx.shadowColor = color;
//             ctx.fillRect(0, 0, canvas.width, canvas.height);

//             ctx.shadowOffsetX = 0;
//             ctx.shadowOffsetY = 0;
//             ctx.shadowBlur = 0;
//             ctx.shadowColor = 'transparent';
//           }

//           // Add text layer if it exists
//           if (imageState.filters.textLayer) {
//             const { text, x, y, fontSize, color, fontFamily = 'Arial', fontWeight = 'normal', textAlign = 'center' } = imageState.filters.textLayer;

//             ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
//             ctx.fillStyle = color;
//             ctx.textAlign = textAlign as CanvasTextAlign;
//             ctx.fillText(text, x, y);
//           }


//           // console.log("ctx", ctx);

//           // ctx.strokeStyle = 'black';
//           // ctx.lineWidth = 5;
//           // console.log("ctx", ctx);
//           // ctx.fillText('text', 200, 200);

//           // ctx.strokeRect(5 / 2, 5 / 2, canvas.width - 5, canvas.height - 5);


//           ctx.restore();
//         };
//       }
//     }
//   }, [imageState]);

//   return <>
//     <h2>editor preview</h2>
//     <canvas ref={canvasRef} width={500} height={500} /></>;
// };

// export default EditorPreview;



// components/ImageEditor/EditorPreview.tsx

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { StoreType } from '../../store/store';

const EditorPreview: React.FC = () => {
  // קבלת מצב התמונה ישירות מ-Redux
  const { imageState } = useSelector((state: StoreType) => state.aiDesign);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      // ניקוי הקנבס
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ציור התמונה
      console.log("in preview", imageState);
      
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = 'http://img.freepik.com/free-photo/bonifacio-lighthouse_181624-5126.jpg?uid=R150112249&ga=GA1.1.1129303057.1731009829&semt=ais_hybrid&w=740';
      
      image.onload = () => {
        ctx.save();
        console.log('*****************');

        // החלת טרנספורמציות אם קיימות
        if (imageState.filters.transform) {
          const { rotation = 0, scale = 1, flipX = false, flipY = false } = imageState.filters.transform;

          ctx.translate(canvas.width / 2, canvas.height / 2);

          if (rotation) {
            ctx.rotate((rotation * Math.PI) / 180);
          }

          if (scale !== 1) {
            ctx.scale(scale, scale);
          }

          if (flipX || flipY) {
            ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
          }

          ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        // החלת חיתוך אם קיים
        if (imageState.filters.crop) {
          const { x, y, width, height } = imageState.filters.crop;
          ctx.drawImage(
            image,
            x, y, width, height, // source
            0, 0, canvas.width, canvas.height // destination
          );
        } else {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }

        // החלת פילטרים אם קיימים
        if (imageState.filters.filter) {
          const { brightness, contrast, saturation, blur, grayscale } = imageState.filters.filter;

          let filterString = '';
          if (brightness !== undefined) filterString += `brightness(${brightness}%) `;
          if (contrast !== undefined) filterString += `contrast(${contrast}%) `;
          if (saturation !== undefined) filterString += `saturate(${saturation}%) `;
          if (blur !== undefined) filterString += `blur(${blur}px) `;
          if (grayscale !== undefined) filterString += `grayscale(${grayscale}%) `;

          if (filterString) {
            ctx.filter = filterString;
            ctx.drawImage(canvas, 0, 0);
            ctx.filter = 'none';
          }
        }

        // הוספת שכבת צבע אם קיימת
        if (imageState.filters.overlay) {
          const { color, blendMode } = imageState.filters.overlay;
          ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'source-over';
        }

        // הוספת מסגרת אם קיימת
        if (imageState.filters.border) {
          const { width, color, style } = imageState.filters.border;
          ctx.strokeStyle = color;
          ctx.lineWidth = width;

          if (style === 'dashed') {
            ctx.setLineDash([10, 5]);
          } else if (style === 'dotted') {
            ctx.setLineDash([2, 2]);
          } else {
            ctx.setLineDash([]);
          }

          ctx.strokeRect(width / 2, width / 2, canvas.width - width, canvas.height - width);
        }

        // הוספת צל אם קיים
        if (imageState.filters.shadow) {
          const { offsetX, offsetY, blur, color } = imageState.filters.shadow;
          ctx.shadowOffsetX = offsetX;
          ctx.shadowOffsetY = offsetY;
          ctx.shadowBlur = blur;
          ctx.shadowColor = color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 0;
          ctx.shadowColor = 'transparent';
        }

        // הוספת שכבת טקסט אם קיימת
        if (imageState.filters.textLayer) {
          const { text, x, y, fontSize, color, fontFamily = 'Arial', fontWeight = 'normal', textAlign = 'center' } = imageState.filters.textLayer;

          ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
          ctx.fillStyle = color;
          ctx.textAlign = textAlign as CanvasTextAlign;
          ctx.fillText(text, x, y);
        }

        ctx.restore();
      };
    }
  }, [imageState]);

  return (
    <>
      <h2>Editor Preview</h2>
      <canvas ref={canvasRef} width={500} height={500} />
    </>
  );
};

export default EditorPreview;