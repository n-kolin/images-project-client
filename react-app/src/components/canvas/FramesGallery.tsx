import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";

interface FramesGalleryProps {
  frames: string[]; // מערך של נתיבי המסגרות
}

const FramesGallery: React.FC<FramesGalleryProps> = ({ frames }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // המיקום ההתחלתי בגלריה
  const navigate = useNavigate();
  const location = useLocation();
  const framesPerPage = 4; // מספר התמונות שיוצגו בכל פעם

  // פונקציה לשינוי המסגרת בפרמטרים של ה-URL
  const setFrameInParams = (frame: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("frame", frame); // הגדרת המסגרת בפרמטרים
    navigate({ search: searchParams.toString() });
  };

  // פונקציות לדפדוף
  const goUp = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - framesPerPage);
    }
  };

  const goDown = () => {
    if (currentIndex + framesPerPage < frames.length) {
      setCurrentIndex(currentIndex + framesPerPage);
    }
  };

  // בחירת המסגרת
  const selectFrame = (frame: string) => {
    setFrameInParams(frame);
  };

  // חישוב התמונות שיוצגו בעמוד הנוכחי
  const visibleFrames = frames.slice(currentIndex, currentIndex + framesPerPage);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* כפתור למעלה */}
      <button onClick={goUp} disabled={currentIndex === 0}>
        ⬆️
      </button>
{/* כפתור למטה */}
<button onClick={goDown} disabled={currentIndex + framesPerPage >= frames.length}>
        ⬇️
      </button>
      {/* הצגת התמונות הנוכחיות */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {visibleFrames.map((frame, index) => (
          <div
            key={currentIndex + index}
            style={{
              border: "2px solid black",
              padding: "10px",
              margin: "10px",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() => selectFrame(frame)}
          >
            <img
              src={frame}
              alt={`Frame ${currentIndex + index + 1}`}
              style={{ maxWidth: "150px", maxHeight: "150px", marginBottom: "5px" }}
            />
            <div style={{ fontSize: "12px", color: "#555" }}>{frame}</div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default FramesGallery;