import React, { useRef, useEffect, useState } from 'react';
import FramesGallery from './FramesGallery';
import Actions from './Actions';
import { useLocation, useSearchParams } from 'react-router';

const CanvasImage: React.FC = () => {


const styles = {
    container: {
      display: "flex",
      flexDirection: "row" as const,
      height: "100vh", // גובה מלא של המסך
    },
    leftPane: {
      flex: 2, // 2 חלקים מתוך 3
      backgroundColor: "#f0f0f0",
      padding: "20px",
      boxSizing: "border-box" as const,
    },
    rightPane: {
      flex: 1, // 1 חלק מתוך 3
      backgroundColor: "#d0d0d0",
      padding: "20px",
      boxSizing: "border-box" as const,
    },
  };


  const location = useLocation();
  const [params, setParams] = useState<Record<string, string>>();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search); // שליפת הפרמטרים
    const paramsObject: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      paramsObject[key] = value; // הפיכת הפרמטרים לאובייקט
    });

    setParams(paramsObject); // עדכון הסטייט עם הפרמטרים
    console.log(params);
    
  }, [location.search]); // תלות ב-location.search


  const canvasRef = useRef<HTMLCanvasElement>(null);

  const arrFrames = [
'../../../public/imgs/1.jpg',
'../../../public/imgs/2.jpg',
'../../../public/imgs/3.jpg',
'../../../public/imgs/4.jpg',
'../../../public/imgs/5.jpg',
'../../../public/imgs/6.jpg',
'../../../public/imgs/7.jpg',
'../../../public/imgs/8.jpg',
'../../../public/imgs/9.jpg',
  ]
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    const frame = new Image();

    // הגדרת נתיב התמונה
    image.src = "https://img.freepik.com/free-vector/flower-background-desktop-wallpaper-cute-vector_53876-136877.jpg?uid=R150112249&ga=GA1.1.1129303057.1731009829&w=740"

    frame.src =  "../../../public/imgs/frame2.png";

    // אירוע טעינת התמונה
    image.onload = () => {
      // התאמת ממדי הקנבס לגודל התמונה
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      canvas.width = image.width;
      canvas.height = image.height;

      // ציור התמונה על הקנבס
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    frame.onload = () => {
        // התאמת ממדי הקנבס לגודל התמונה
        ctx.save()
  
        // ציור התמונה על הקנבס
        ctx.translate(canvas.width / 2, canvas.height / 2);

      // סיבוב ב-45 מעלות (Math.PI / 4 רדיאנים)
      console.log("rotate", params['rotate']);
      
      ctx.rotate(Number(params['rotate']));

      // ציור התמונה לאחר הסיבוב
      ctx.drawImage(frame, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

      // החזרת ההקשר למצב המקורי
      ctx.resetTransform();

ctx.restore()


//font

ctx.font = "50px serif";
const text = params.text
const opacity = Number(params.opacity) || 1
const xPosition = Number(params.xPosition) || 50
ctx.globalAlpha = opacity
// ctx.globalCompositeOperation = "multiply"; // אפקט כהה

ctx.shadowColor =`rgba(0, 0, 0, 0.5)`;
if(params.stroke === "true"){
    console.log('hdg');
    ctx.strokeStyle = params.strokeColor || `black`;
    ctx.strokeText(text, xPosition, 50);
}
if(params.fill === "true"){
ctx.fillStyle = params.fillColor || `black`;
ctx.fillText(text, xPosition, 50);
}

        // ctx.translate(150, 75);
        // ctx.rotate(Math.PI / 2);
        // ctx.translate(-150, -75);        
        // ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
      };
  }, [params]); // הוספת params כתלות כדי לטעון מחדש את התמונה כאשר הפרמטרים משתנים

  return (<>
    <div>
<Actions/>
    </div>
    <div style={styles.container}>
    <div style={styles.leftPane}>
      <h2>Canvas Image</h2>
      <canvas ref={canvasRef} />
    </div>
    <div style={styles.rightPane}>
        <FramesGallery frames={arrFrames}/>
    </div>
    </div>

    </>
  );
};

export default CanvasImage;