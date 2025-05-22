"use client"

import { useEffect, useState, useRef } from "react"
import type { FrameType } from "../../types/FrameType"
import LittleFrame from "./LittleFrame"
import { Box, Typography, IconButton, Tooltip } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react'

const Gallery = () => {
  // דוגמה לנתונים - במקרה אמיתי אלה יגיעו מ-Redux
  const [frames, setFrames] = useState<Partial<FrameType>[]>([
    { id: 1, name: "1", path: "../../../public/imgs/1.jpg" },
    { id: 2, name: "2", path: "../../../public/imgs/2.jpg" },
    { id: 3, name: "3", path: "../../../public/imgs/3.jpg" },
    { id: 4, name: "4", path: "../../../public/imgs/4.jpg" },
    { id: 5, name: "5", path: "../../../public/imgs/5.jpg" },
    { id: 6, name: "6", path: "../../../public/imgs/6.jpg" },
    { id: 7, name: "7", path: "../../../public/imgs/7.jpg" },
    { id: 8, name: "8", path: "../../../public/imgs/8.jpg" },
    { id: 9, name: "9", path: "../../../public/imgs/9.jpg" },
    { id: 10, name: "10", path: "../../../public/imgs/10.jpg" },
    { id: 11, name: "11", path: "../../../public/imgs/11.jpg" },
    { id: 12, name: "12", path: "../../../public/imgs/12.jpg" },
    { id: 12, name: "12", path: "../../../public/imgs/13.jpg" },
    { id: 12, name: "12", path: "../../../public/imgs/14.jpg" },
    { id: 12, name: "12", path: "../../../public/imgs/15.jpg" },
    { id: 12, name: "12", path: "../../../public/imgs/16.jpg" },
    { id: 12, name: "12", path: "../../../public/imgs/17.jpg" },
  ])

  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 4 // מספר התמונות בכל עמוד
  const totalItems = frames.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const galleryRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [direction, setDirection] = useState(0)

  // ערכות צבעים מסתוריות - כל ערכה מכילה 3 צבעים דומים
  const colorSchemes = [
    // כחול מסתורי
    ["#1a2a6c", "#2a4b8c", "#3b6fcc"],
    // סגול מיסטי
    ["#5f2c82", "#7a3a9a", "#9d50bb"],
    // טורקיז עמוק
    ["#136a8a", "#267871", "#42a58e"],
    // אדום כהה
    ["#5a0000", "#870000", "#a71d31"],
    // ירוק יער
    ["#134e5e", "#1d7874", "#2a9d8f"],
  ]

  // בחירת ערכת צבעים אקראית בטעינה
  const [currentColorScheme, setCurrentColorScheme] = useState(
    colorSchemes[Math.floor(Math.random() * colorSchemes.length)],
  )

  // חישוב התמונות שיוצגו בעמוד הנוכחי
  const getCurrentFrames = () => {
    const startIndex = currentIndex
    return frames.slice(startIndex, startIndex + itemsPerPage)
  }

  // מעבר תמונה אחת קדימה
  const handleNextOne = () => {
    if (currentIndex < totalItems - itemsPerPage) {
      setDirection(1)
      setCurrentIndex(Math.min(currentIndex + 1, totalItems - itemsPerPage))
    }
  }

  // מעבר תמונה אחת אחורה
  const handlePrevOne = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(Math.max(currentIndex - 1, 0))
    }
  }

  // מעבר 4 תמונות קדימה (עמוד שלם)
  const handleNextPage = () => {
    if (currentIndex < totalItems - itemsPerPage) {
      setDirection(itemsPerPage)
      setCurrentIndex(Math.min(currentIndex + itemsPerPage, totalItems - itemsPerPage))
      // החלפת ערכת צבעים בכל מעבר עמוד
      setCurrentColorScheme(colorSchemes[Math.floor(Math.random() * colorSchemes.length)])
    }
  }

  // מעבר 4 תמונות אחורה (עמוד שלם)
  const handlePrevPage = () => {
    if (currentIndex > 0) {
      setDirection(-itemsPerPage)
      setCurrentIndex(Math.max(currentIndex - itemsPerPage, 0))
      // החלפת ערכת צבעים בכל מעבר עמוד
      setCurrentColorScheme(colorSchemes[Math.floor(Math.random() * colorSchemes.length)])
    }
  }

  // אפקט גלילה אוטומטית כשעוברים בין עמודים
  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [currentIndex])

  return (
    <Box
      ref={galleryRef}
      sx={{
        position: "relative",
        width: "100%",
        height: "33vh",
        overflow: "hidden",
        background: "white", // רקע לבן
        borderRadius: "20px", // פינות מעוגלות יותר
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        my: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        border: "1px solid #f0f0f0",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* רקע גרדיאנט מסתורי */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${currentColorScheme[0]}10, ${currentColorScheme[1]}15, ${currentColorScheme[2]}10)`,
          opacity: 0.7,
          zIndex: 0,
        }}
      />

      {/* אפקט גלים מסתוריים */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `
            radial-gradient(circle at 30% 20%, ${currentColorScheme[0]}, transparent 25%),
            radial-gradient(circle at 70% 65%, ${currentColorScheme[1]}, transparent 25%),
            radial-gradient(circle at 20% 80%, ${currentColorScheme[2]}, transparent 25%)
          `,
          zIndex: 0,
        }}
      />

      {/* כותרת */}
      <Typography
        variant="h5"
        component="div"
        sx={{
          textAlign: "center",
          mb: 2,
          color: currentColorScheme[1],
          fontWeight: "bold",
          letterSpacing: "1px",
          position: "relative",
          zIndex: 1,
          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        Image Gallery
      </Typography>

      {/* כפתורי ניווט בצד שמאל */}
      <Box sx={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", zIndex: 10 }}>
        {/* Single arrow back */}
        <Tooltip title="Previous Image">
          <IconButton
            sx={{
              width: "40px",
              height: "40px",
              color: currentColorScheme[1],
              opacity: isHovered ? 1 : 0.7,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
              "&:disabled": {
                opacity: 0.3,
              },
            }}
            onClick={handlePrevOne}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </IconButton>
        </Tooltip>

        {/* Double arrow back */}
        <Tooltip title="Previous Page">
          <IconButton
            sx={{
              mb: 1,
              width: "40px",
              height: "40px",
              color: currentColorScheme[1],
              opacity: isHovered ? 1 : 0.7,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
              "&:disabled": {
                opacity: 0.3,
              },
            }}
            onClick={handlePrevPage}
            disabled={currentIndex === 0}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={20} style={{ marginRight: '-8px' }} />
              <ChevronLeft size={20} />
            </Box>
          </IconButton>
        </Tooltip>
      </Box>

      {/* מיכל התמונות עם אנימציה */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 8,
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{
              x: direction > 0 ? 500 : -500,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: direction < 0 ? 500 : -500,
              opacity: 0,
            }}
            transition={{
              type: Math.abs(direction) === 1 ? "tween" : "spring",
              stiffness: Math.abs(direction) === 1 ? undefined : 300,
              damping: Math.abs(direction) === 1 ? undefined : 30,
              duration: Math.abs(direction) === 1 ? 0.3 : undefined,
            }}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            {getCurrentFrames().map((frame, index) => (
              <Box
                key={frame.id || index}
                sx={{
                  flex: 1,
                  maxWidth: "25%",
                  transform: `perspective(1000px) rotateY(${(index - 1.5) * 5}deg)`,
                  transition: "transform 0.5s",
                  "&:hover": {
                    transform: "perspective(1000px) rotateY(0deg) scale(1.05)",
                    zIndex: 5,
                  },
                }}
              >
                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: `0 10px 20px rgba(0, 0, 0, 0.15), 0 0 10px ${currentColorScheme[index % 3]}`,
                  }}
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: `0 8px 20px rgba(0, 0, 0, 0.15)`,
                    border: `2px solid ${currentColorScheme[index % 3]}`,
                    position: "relative",
                  }}
                >
                  <LittleFrame title={frame.name || ""} imageUrl={frame.path || ""} description={currentColorScheme[index % 3]} />

                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      p: 1,
                      color: "white",
                      fontWeight: "medium",
                      background: `linear-gradient(to right, ${currentColorScheme[index % 3]}, ${
                        currentColorScheme[(index + 1) % 3]
                      })`,
                      borderBottomLeftRadius: "18px",
                      borderBottomRightRadius: "18px",
                    }}
                  >
                    {frame.name}
                  </Typography>
                </motion.div>
              </Box>
            ))}
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* כפתורי ניווט בצד ימין */}
      <Box sx={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", zIndex: 10 }}>
        {/* Single arrow forward */}
        <Tooltip title="Next Image">
          <IconButton
            sx={{
              mb: 1,
              width: "40px",
              height: "40px",
              color: currentColorScheme[1],
              opacity: isHovered ? 1 : 0.7,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
              "&:disabled": {
                opacity: 0.3,
              },
            }}
            onClick={handleNextOne}
            disabled={currentIndex >= totalItems - itemsPerPage}
          >
            <ChevronRight size={20} />
          </IconButton>
        </Tooltip>

        {/* Double arrow forward */}
        <Tooltip title="Next Page">
          <IconButton
            sx={{
              width: "40px",
              height: "40px",
              color: currentColorScheme[1],
              opacity: isHovered ? 1 : 0.7,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
              "&:disabled": {
                opacity: 0.3,
              },
            }}
            onClick={handleNextPage}
            disabled={currentIndex >= totalItems - itemsPerPage}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={20} style={{ marginLeft: '-8px' }} />
              <ChevronRight size={20} />
            </Box>
          </IconButton>
        </Tooltip>
      </Box>

      {/* אינדיקטור מיקום מסתורי */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          mt: 2,
          mb: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.3 }}
            onClick={() => {
              setCurrentIndex(i * itemsPerPage)
              setCurrentColorScheme(colorSchemes[Math.floor(Math.random() * colorSchemes.length)])
            }}
            style={{
              width: i === Math.floor(currentIndex / itemsPerPage) ? "12px" : "8px",
              height: i === Math.floor(currentIndex / itemsPerPage) ? "12px" : "8px",
              borderRadius: "50%",
              background:
                i === Math.floor(currentIndex / itemsPerPage)
                  ? `linear-gradient(135deg, ${currentColorScheme[0]}, ${currentColorScheme[2]})`
                  : "#e0e0e0",
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: i === Math.floor(currentIndex / itemsPerPage) ? `0 0 10px ${currentColorScheme[1]}80` : "none",
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default Gallery