import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { StoreType } from '../../store/store';
import { useLocation, useNavigate } from 'react-router';
import apiClient from '../../apiClient';
import { IconButton } from '@mui/material';
import { SaveAltRounded } from '@mui/icons-material';
import "../../css/EditorPreview.css"

const EditorPreview: React.FC = () => {

  const currentUser = useSelector((state: StoreType) => state.auth.currentUser);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [path, setPath] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const u = searchParams.get('url');
    if (u) {
      setPath(u);
    }

  }, [searchParams]);


  useEffect(() => {
    const download = async () => {
      const response = await apiClient.get('file/download-url', {
        params: {
          userId: currentUser?.id,
          path: path
        },
      }).then((res) => {
        setUrl(res.data.url);
      });
      console.log(response);

    };
    if (path ) {
      download();
    }
  }, [path]);

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const dataURL = canvas.toDataURL("image/png", 1.0)

      // יצירת קישור הורדה
      const link = document.createElement("a")
      link.download = `edited-image-${Date.now()}.png`
      link.href = dataURL

      // הפעלת ההורדה
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // קבלת מצב התמונה ישירות מ-Redux
  const { imageState } = useSelector((state: StoreType) => state.aiDesign);
  // const imageState = useSelector((state: StoreType) => state.aiDesign.present.imageState)

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
      image.crossOrigin = "anonymous"

      image.src = url || '';
      console.log('url', url);


      console.log('image.src', image.src);
      
      image.onload = () => {
        ctx.save();

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
  }, [imageState, path, url]);

  return (
    <>
      <div className="image-canvas-container">
        <canvas ref={canvasRef} width={500} height={500} />
        <IconButton size="small" onClick={downloadImage} className="download-icon">
          <SaveAltRounded />
        </IconButton>
      </div>
    </>
  );
};

export default EditorPreview;