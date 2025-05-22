"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Box,
  Button,
  Typography,
  Slider,
  TextField,
  Paper,
  IconButton,
  Grid,
  Drawer,
  createTheme,
  ThemeProvider,
  styled,
} from "@mui/material"

// MUI icons
import UndoIcon from "@mui/icons-material/Undo"
import RedoIcon from "@mui/icons-material/Redo"
import RefreshIcon from "@mui/icons-material/Refresh"
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"
import SaveIcon from "@mui/icons-material/Save"
import OpenWithIcon from "@mui/icons-material/OpenWith"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import RotateRightIcon from "@mui/icons-material/RotateRight"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import CropIcon from "@mui/icons-material/Crop"
import MovieIcon from "@mui/icons-material/Movie"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import TouchAppIcon from "@mui/icons-material/TouchApp"

type Tool = "select" | "move" | "zoom" | "rotate" | "resize" | "crop" | "animate"
type AnimationState = "playing" | "paused" | "stopped"
type CropHandlePosition = "top" | "right" | "bottom" | "left" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight"

// Type for crop data
type CropData = {
  x: number
  y: number
  width: number
  height: number
}

// Create a default theme to use for styled components
const defaultTheme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
    },
    secondary: {
      main: "#00796b",
    },
  },
})

// Styled components with safer theme access
const RootContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "600px",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  border: "1px solid #e0e0e0",
  background: "linear-gradient(to bottom right, #ffffff, #f5f5f5)",
})

const Toolbar = styled(Box)({
  display: "flex",
  padding: "12px",
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #e0e0e0",
  justifyContent: "space-between",
  alignItems: "center",
})

const ToolButtonContainer = styled(Box)({
  display: "flex",
  gap: "8px",
})

interface ToolButtonProps {
  active?: boolean
}

const ToolButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<ToolButtonProps>(({ active }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  borderRadius: "8px",
  transition: "all 0.2s",
  width: "70px",
  height: "70px",
  margin: "0 4px",
  ...(active
    ? {
        background: "linear-gradient(to bottom right, #2e7d32, #1b5e20)",
        color: "#ffffff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      }
    : {
        backgroundColor: "#ffffff",
        color: "#333333",
        border: "1px solid #e0e0e0",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }),
}))

const ToolIcon = styled(Box)({
  fontSize: "1.25rem",
  marginBottom: "4px",
})

const ToolLabel = styled(Typography)({
  fontSize: "0.75rem",
  fontWeight: 500,
})

const ContentArea = styled(Box)({
  display: "flex",
  flex: 1,
  overflow: "hidden",
})

const CanvasArea = styled(Box)({
  flex: 1,
  position: "relative",
  overflow: "hidden",
  backgroundColor: "#f5f5f5",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Crect width='10' height='10' fill='%23f9f9f9'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23f9f9f9'/%3E%3C/svg%3E")`,
})

const StatusBar = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "4px 16px",
  backgroundColor: "#333333",
  color: "#e0e0e0",
  fontSize: "0.75rem",
})

const SidePanel = styled(Drawer)({
  width: 250,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 250,
    position: "relative",
    border: "none",
    borderLeft: "1px solid #e0e0e0",
  },
})

const EffectGrid = styled(Grid)({
  marginBottom: "16px",
})

interface EffectItemProps {
  active?: boolean
}

const EffectItem = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "active",
})<EffectItemProps>(({ active }) => ({
  padding: "8px",
  cursor: "pointer",
  transition: "all 0.2s",
  border: active ? "2px solid #2e7d32" : "1px solid #e0e0e0",
  backgroundColor: active ? "rgba(76, 175, 80, 0.1)" : "#ffffff",
  "&:hover": {
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
}))

const EffectImage = styled(Box)({
  aspectRatio: "1/1",
  position: "relative",
  overflow: "hidden",
  borderRadius: "4px",
  marginBottom: "4px",
})

const EffectName = styled(Typography)({
  fontSize: "0.75rem",
  textAlign: "center",
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})

const SliderContainer = styled(Box)({
  marginBottom: "16px",
})

const SliderLabel = styled(Typography)({
  display: "block",
  marginBottom: "8px",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#666666",
})

const SliderControls = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
})

const CropOverlay = styled(Box)({
  position: "absolute",
  border: "2px solid #ffffff",
  boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
  pointerEvents: "none",
})

const CropDimensions = styled(Box)({
  position: "absolute",
  top: "-32px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "rgba(0,0,0,0.75)",
  color: "#ffffff",
  fontSize: "0.75rem",
  padding: "4px 8px",
  borderRadius: "4px",
})

const CropControls = styled(Box)({
  position: "absolute",
  bottom: "16px",
  right: "16px",
  display: "flex",
  gap: "8px",
})

const AnimationControls = styled(Box)({
  position: "absolute",
  bottom: "16px",
  left: "16px",
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "#ffffff",
  padding: "12px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
})

const AnimationTitle = styled(Typography)({
  fontSize: "0.875rem",
  fontWeight: 700,
  marginBottom: "4px",
})

const AnimationButtons = styled(Box)({
  display: "flex",
  gap: "8px",
})

const AnimationButton = styled(Button)({
  padding: "4px 8px",
  fontSize: "0.75rem",
  minWidth: "auto",
})

const AnimationInfo = styled(Typography)({
  fontSize: "0.75rem",
})

const ToolIndicator = styled(Box)({
  position: "absolute",
  bottom: "16px",
  left: "16px",
  backgroundColor: "rgba(0,0,0,0.8)",
  color: "#ffffff",
  padding: "8px 12px",
  borderRadius: "8px",
  fontSize: "0.875rem",
})

export default function FramePreview() {
  const imageUrl = "/imgs/1.jpg"
  const frameUrl = "/imgs/frame2.png"
  const onSave = () => {}

  // State for image transformations
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [activeTool, setActiveTool] = useState<Tool>("select")
  const [isDragging, setIsDragging] = useState(false)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [startValues, setStartValues] = useState({ x: 0, y: 0, scale: 1, rotation: 0 })
  const [history, setHistory] = useState<
    Array<{ x: number; y: number; scale: number; rotation: number; cropData?: CropData }>
  >([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [effectStyle, setEffectStyle] = useState<string>("none")
  const [showEffectsPanel, setShowEffectsPanel] = useState(false)
  const [resizeHandles, setResizeHandles] = useState<boolean>(true)
  const [activeCropHandle, setActiveCropHandle] = useState<CropHandlePosition | null>(null)

  // New states for crop functionality
  const [cropMode, setCropMode] = useState(false)
  const [cropData, setCropData] = useState<CropData>({ x: 0, y: 0, width: 0, height: 0 })
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 })
  const [originalImageSize, setOriginalImageSize] = useState({ width: 0, height: 0 })

  // New states for animation
  const [animationState, setAnimationState] = useState<AnimationState>("stopped")
  const [animationFrames, setAnimationFrames] = useState<
    Array<{ x: number; y: number; scale: number; rotation: number }>
  >([])
  const [currentFrame, setCurrentFrame] = useState(0)
  const [showToolDemo, setShowToolDemo] = useState<Tool | null>(null)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const frameRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  // Initialize history
  useEffect(() => {
    if (historyIndex === -1) {
      const initialState = { x: positionX, y: positionY, scale, rotation }
      setHistory([initialState])
      setHistoryIndex(0)
    }
  }, [])

  // Store original image size when loaded
  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setOriginalImageSize({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      })
    }
  }, [imageRef.current])

  // Add to history when transformations change
  useEffect(() => {
    if (historyIndex !== -1 && animationState !== "playing") {
      const currentState = {
        x: positionX,
        y: positionY,
        scale,
        rotation,
        ...(cropMode ? { cropData } : {}),
      }

      // Check if the current state is different from the last history item
      const lastState = history[historyIndex]
      if (
        lastState.x !== currentState.x ||
        lastState.y !== currentState.y ||
        lastState.scale !== currentState.scale ||
        lastState.rotation !== currentState.rotation ||
        JSON.stringify(lastState.cropData) !== JSON.stringify(currentState.cropData)
      ) {
        // If we're not at the end of history, truncate it
        if (historyIndex < history.length - 1) {
          setHistory((prev) => [...prev.slice(0, historyIndex + 1), currentState])
          setHistoryIndex(historyIndex + 1)
        } else {
          // Add to the end of history
          setHistory((prev) => [...prev, currentState])
          setHistoryIndex(history.length)
        }
      }
    }
  }, [positionX, positionY, scale, rotation, cropData, historyIndex, history, animationState, cropMode])

  // Animation effect
  useEffect(() => {
    if (animationState === "playing" && animationFrames.length > 0) {
      let frameIndex = currentFrame

      const animate = () => {
        if (frameIndex >= animationFrames.length) {
          frameIndex = 0
        }

        const frame = animationFrames[frameIndex]
        setPositionX(frame.x)
        setPositionY(frame.y)
        setScale(frame.scale)
        setRotation(frame.rotation)
        setCurrentFrame(frameIndex)

        frameIndex++
        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [animationState, animationFrames, currentFrame])

  // Tool demo effect
  useEffect(() => {
    if (showToolDemo) {
      const timer = setTimeout(() => {
        setShowToolDemo(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showToolDemo])

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setPositionX(prevState.x)
      setPositionY(prevState.y)
      setScale(prevState.scale)
      setRotation(prevState.rotation)
      if (prevState.cropData) {
        setCropData(prevState.cropData)
      }
      setHistoryIndex(historyIndex - 1)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setPositionX(nextState.x)
      setPositionY(nextState.y)
      setScale(nextState.scale)
      setRotation(nextState.rotation)
      if (nextState.cropData) {
        setCropData(nextState.cropData)
      }
      setHistoryIndex(historyIndex + 1)
    }
  }

  const handleReset = () => {
    setScale(1)
    setRotation(0)
    setPositionX(0)
    setPositionY(0)
    setEffectStyle("none")
    setCropData({ x: 0, y: 0, width: 0, height: 0 })
    setCropMode(false)
  }

  const handleSaveImage = () => {
    if (!containerRef.current || !imageRef.current || !frameRef.current) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match container
    const containerRect = containerRef.current.getBoundingClientRect()
    canvas.width = containerRect.width
    canvas.height = containerRect.height

    // Draw background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Save context state
    ctx.save()

    // Apply transformations for image
    ctx.translate(containerRect.width / 2 + positionX, containerRect.height / 2 + positionY)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(scale, scale)

    // Apply image effects
    if (effectStyle !== "none") {
      ctx.filter = getFilterString(effectStyle)
    }

    // Draw image centered
    const img = imageRef.current

    if (cropMode && cropData.width > 0 && cropData.height > 0) {
      // Draw only the cropped portion
      ctx.drawImage(
        img,
        cropData.x,
        cropData.y,
        cropData.width,
        cropData.height,
        -cropData.width / 2,
        -cropData.height / 2,
        cropData.width,
        cropData.height,
      )
    } else {
      // Draw the full image
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)
    }

    // Restore context state
    ctx.restore()

    // Draw frame on top (centered)
    const frame = frameRef.current
    const frameX = (containerRect.width - frame.width) / 2
    const frameY = (containerRect.height - frame.height) / 2
    ctx.drawImage(frame, frameX, frameY, frame.width, frame.height)

    // Get data URL
    const dataUrl = canvas.toDataURL("image/png")

    // Call onSave callback if provided
    if (onSave) {
      onSave(dataUrl)
    } else {
      // Create download link
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = "framed-image.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getFilterString = (style: string) => {
    switch (style) {
      case "sepia":
        return "sepia(0.7)"
      case "grayscale":
        return "grayscale(1)"
      case "vintage":
        return "sepia(0.5) contrast(1.2) brightness(0.9)"
      case "bright":
        return "brightness(1.2) contrast(1.1)"
      case "cool":
        return "saturate(1.5) hue-rotate(15deg)"
      case "warm":
        return "saturate(1.5) hue-rotate(-15deg) brightness(1.1)"
      default:
        return "none"
    }
  }

  // Handle crop handle mouse down
  const handleCropHandleMouseDown = (e: React.MouseEvent, position: CropHandlePosition) => {
    e.stopPropagation()
    setActiveCropHandle(position)
    setIsDragging(true)
    setStartPoint({ x: e.clientX, y: e.clientY })

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    if (cropMode) {
      // Handle crop start
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setCropStart({ x, y })
      setCropData({ x, y, width: 0, height: 0 })
      setIsDragging(true)
    } else {
      setIsDragging(true)
      setStartPoint({ x: e.clientX, y: e.clientY })
      setStartValues({
        x: positionX,
        y: positionY,
        scale,
        rotation,
      })
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    if (cropMode) {
      if (activeCropHandle) {
        // Handle crop resize via handles
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const currentX = e.clientX - rect.left
        const currentY = e.clientY - rect.top
        const deltaX = currentX - startPoint.x
        const deltaY = currentY - startPoint.y

        const newCropData = { ...cropData }

        switch (activeCropHandle) {
          case "top":
            newCropData.y += deltaY
            newCropData.height -= deltaY
            break
          case "right":
            newCropData.width += deltaX
            break
          case "bottom":
            newCropData.height += deltaY
            break
          case "left":
            newCropData.x += deltaX
            newCropData.width -= deltaX
            break
          case "topLeft":
            newCropData.x += deltaX
            newCropData.y += deltaY
            newCropData.width -= deltaX
            newCropData.height -= deltaY
            break
          case "topRight":
            newCropData.y += deltaY
            newCropData.width += deltaX
            newCropData.height -= deltaY
            break
          case "bottomLeft":
            newCropData.x += deltaX
            newCropData.width -= deltaX
            newCropData.height += deltaY
            break
          case "bottomRight":
            newCropData.width += deltaX
            newCropData.height += deltaY
            break
        }

        // Ensure width and height are positive
        if (newCropData.width < 10) {
          if (activeCropHandle.includes("Left")) {
            newCropData.x = cropData.x + cropData.width - 10
          }
          newCropData.width = 10
        }

        if (newCropData.height < 10) {
          if (activeCropHandle.includes("top")) {
            newCropData.y = cropData.y + cropData.height - 10
          }
          newCropData.height = 10
        }

        setCropData(newCropData)
        setStartPoint({ x: currentX, y: currentY })
      } else {
        // Handle crop creation
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setCropData({
          x: Math.min(cropStart.x, x),
          y: Math.min(cropStart.y, y),
          width: Math.abs(x - cropStart.x),
          height: Math.abs(y - cropStart.y),
        })
      }
    } else {
      const deltaX = e.clientX - startPoint.x
      const deltaY = e.clientY - startPoint.y

      switch (activeTool) {
        case "move":
          // Smoother move with requestAnimationFrame
          requestAnimationFrame(() => {
            setPositionX(startValues.x + deltaX)
            setPositionY(startValues.y + deltaY)
          })
          break
        case "zoom":
          // Calculate zoom based on vertical movement (up = zoom in, down = zoom out)
          const zoomFactor = 1 + deltaY * -0.005
          const newScale = Math.max(0.1, Math.min(5, startValues.scale * zoomFactor))
          setScale(newScale)
          break
        case "rotate":
          // Calculate angle based on movement relative to center
          if (!containerRef.current) break

          const rect = containerRef.current.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2

          const startAngle = Math.atan2(startPoint.y - centerY, startPoint.x - centerX)
          const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
          const angleDiff = (currentAngle - startAngle) * (180 / Math.PI)

          setRotation(startValues.rotation + angleDiff)
          break
        case "resize":
          // Calculate scale based on distance from center (outward = larger)
          if (!containerRef.current) break

          const containerRect = containerRef.current.getBoundingClientRect()
          const centerX2 = containerRect.left + containerRect.width / 2
          const centerY2 = containerRect.top + containerRect.height / 2

          // Calculate distances
          const startDistance = Math.sqrt(Math.pow(startPoint.x - centerX2, 2) + Math.pow(startPoint.y - centerY2, 2))

          const currentDistance = Math.sqrt(Math.pow(e.clientX - centerX2, 2) + Math.pow(e.clientY - centerY2, 2))

          // Calculate scale factor based on the ratio of distances
          const scaleFactor = currentDistance / startDistance
          const newSize = Math.max(0.1, Math.min(5, startValues.scale * scaleFactor))
          setScale(newSize)
          break
        default:
          break
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setActiveCropHandle(null)

    // Always return to select tool when mouse is released
    if (activeTool !== "crop" && activeTool !== "animate") {
      setActiveTool("select")
    }

    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool)

    // Special handling for crop and animate tools
    if (tool === "crop") {
      setCropMode(true)
    } else if (tool === "animate") {
      // Do nothing special yet
    } else {
      setCropMode(false)
    }

    // Show tool demo
    setShowToolDemo(tool)
  }

  const handleApplyCrop = () => {
    if (cropData.width > 0 && cropData.height > 0) {
      // Keep the crop data but exit crop mode
      setCropMode(false)
      setActiveTool("select")
    }
  }

  const handleCancelCrop = () => {
    setCropData({ x: 0, y: 0, width: 0, height: 0 })
    setCropMode(false)
    setActiveTool("select")
  }

  const handleAddAnimationFrame = () => {
    const newFrame = { x: positionX, y: positionY, scale, rotation }
    setAnimationFrames((prev) => [...prev, newFrame])
  }

  const handleClearAnimation = () => {
    setAnimationFrames([])
    setAnimationState("stopped")
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const handleToggleAnimation = () => {
    if (animationState === "playing") {
      setAnimationState("paused")
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else {
      setAnimationState("playing")
    }
  }

  const handleCaptureCurrentFrame = () => {
    if (animationState === "paused" && currentFrame < animationFrames.length) {
      // Update the current position to match the animation frame
      const frame = animationFrames[currentFrame]
      setPositionX(frame.x)
      setPositionY(frame.y)
      setScale(frame.scale)
      setRotation(frame.rotation)
      setAnimationState("stopped")
    }
  }

  // Render crop handle
  const CropHandle = ({ position }: { position: CropHandlePosition }) => {
    const style: React.CSSProperties = {
      position: "absolute",
      width: position.includes("Left") || position.includes("Right") ? "12px" : "20px",
      height: position.includes("top") || position.includes("bottom") ? "12px" : "20px",
      backgroundColor: "white",
      border: "2px solid #2e7d32",
      zIndex: 10,
    }

    let cursor = "default"

    switch (position) {
      case "top":
        style.top = "-6px"
        style.left = "calc(50% - 10px)"
        cursor = "ns-resize"
        break
      case "right":
        style.right = "-6px"
        style.top = "calc(50% - 10px)"
        cursor = "ew-resize"
        break
      case "bottom":
        style.bottom = "-6px"
        style.left = "calc(50% - 10px)"
        cursor = "ns-resize"
        break
      case "left":
        style.left = "-6px"
        style.top = "calc(50% - 10px)"
        cursor = "ew-resize"
        break
      case "topLeft":
        style.top = "-6px"
        style.left = "-6px"
        style.borderRadius = "50%"
        cursor = "nwse-resize"
        break
      case "topRight":
        style.top = "-6px"
        style.right = "-6px"
        style.borderRadius = "50%"
        cursor = "nesw-resize"
        break
      case "bottomLeft":
        style.bottom = "-6px"
        style.left = "-6px"
        style.borderRadius = "50%"
        cursor = "nesw-resize"
        break
      case "bottomRight":
        style.bottom = "-6px"
        style.right = "-6px"
        style.borderRadius = "50%"
        cursor = "nwse-resize"
        break
    }

    style.cursor = cursor

    return <Box style={style} onMouseDown={(e) => handleCropHandleMouseDown(e, position)} />
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <RootContainer>
        {/* Toolbar */}
        <Toolbar>
          <ToolButtonContainer>
            <ToolButton active={activeTool === "select"} onClick={() => handleToolClick("select")}>
              <ToolIcon>
                <TouchAppIcon />
              </ToolIcon>
              <ToolLabel>בחירה</ToolLabel>
            </ToolButton>
            <ToolButton active={activeTool === "move"} onClick={() => handleToolClick("move")}>
              <ToolIcon>
                <OpenWithIcon />
              </ToolIcon>
              <ToolLabel>הזזה</ToolLabel>
            </ToolButton>
            <ToolButton active={activeTool === "zoom"} onClick={() => handleToolClick("zoom")}>
              <ToolIcon>
                <ZoomInIcon />
              </ToolIcon>
              <ToolLabel>זום</ToolLabel>
            </ToolButton>
            <ToolButton active={activeTool === "rotate"} onClick={() => handleToolClick("rotate")}>
              <ToolIcon>
                <RotateRightIcon />
              </ToolIcon>
              <ToolLabel>סיבוב</ToolLabel>
            </ToolButton>
            <ToolButton active={activeTool === "resize"} onClick={() => handleToolClick("resize")}>
              <ToolIcon>
                <FullscreenIcon />
              </ToolIcon>
              <ToolLabel>גודל</ToolLabel>
            </ToolButton>
            <ToolButton active={activeTool === "crop"} onClick={() => handleToolClick("crop")}>
              <ToolIcon>
                <CropIcon />
              </ToolIcon>
              <ToolLabel>חיתוך</ToolLabel>
            </ToolButton>
            <ToolButton active={activeTool === "animate"} onClick={() => handleToolClick("animate")}>
              <ToolIcon>
                <MovieIcon />
              </ToolIcon>
              <ToolLabel>אנימציה</ToolLabel>
            </ToolButton>
          </ToolButtonContainer>

          <ToolButtonContainer>
            <IconButton
              disabled={historyIndex <= 0}
              onClick={handleUndo}
              sx={{
                opacity: historyIndex <= 0 ? 0.5 : 1,
                cursor: historyIndex <= 0 ? "not-allowed" : "pointer",
              }}
            >
              <UndoIcon />
            </IconButton>
            <IconButton
              disabled={historyIndex >= history.length - 1}
              onClick={handleRedo}
              sx={{
                opacity: historyIndex >= history.length - 1 ? 0.5 : 1,
                cursor: historyIndex >= history.length - 1 ? "not-allowed" : "pointer",
              }}
            >
              <RedoIcon />
            </IconButton>
            <IconButton onClick={handleReset}>
              <RefreshIcon />
            </IconButton>
            <IconButton
              onClick={() => setShowEffectsPanel(!showEffectsPanel)}
              color={showEffectsPanel ? "primary" : "default"}
            >
              <AutoFixHighIcon />
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveImage}
              sx={{ ml: 1 }}
            >
              שמור
            </Button>
          </ToolButtonContainer>
        </Toolbar>

        {/* Main content area */}
        <ContentArea>
          {/* Canvas area */}
          <CanvasArea
            ref={containerRef}
            sx={{
              cursor:
                activeTool === "move"
                  ? "move"
                  : activeTool === "zoom"
                    ? "zoom-in"
                    : activeTool === "rotate"
                      ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='black' strokeWidth='2'%3E%3Cpath d='M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2'/%3E%3C/svg%3E\"), auto"
                      : activeTool === "resize"
                        ? "nesw-resize"
                        : activeTool === "crop"
                          ? "crosshair"
                          : "default",
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Image with transformations */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: `translate(-50%, -50%) translate(${positionX}px, ${positionY}px) rotate(${rotation}deg) scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              <Box
                component="img"
                ref={imageRef}
                src={imageUrl || "/placeholder.svg"}
                alt="Base Image"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  filter: getFilterString(effectStyle),
                  transformOrigin: "center center",
                  clipPath:
                    cropMode || (cropData.width > 0 && cropData.height > 0)
                      ? `inset(${cropData.y}px ${cropData.x}px ${cropData.y + cropData.height}px ${cropData.x + cropData.width}px)`
                      : "none",
                }}
                onLoad={(e) => {
                  // Ensure image is loaded before showing
                  const img = e.target as HTMLImageElement
                  img.style.display = "block"
                  setOriginalImageSize({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                  })
                }}
              />

              {/* Resize handles */}
              {activeTool === "resize" && resizeHandles && (
                <>
                  {/* Top-left handle */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: -12,
                      width: 24,
                      height: 24,
                      bgcolor: "background.paper",
                      border: "2px solid #2e7d32",
                      borderRadius: "50%",
                      cursor: "nwse-resize",
                      zIndex: 10,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                  {/* Top-right handle */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -12,
                      right: -12,
                      width: 24,
                      height: 24,
                      bgcolor: "background.paper",
                      border: "2px solid #2e7d32",
                      borderRadius: "50%",
                      cursor: "nesw-resize",
                      zIndex: 10,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                  {/* Bottom-left handle */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -12,
                      left: -12,
                      width: 24,
                      height: 24,
                      bgcolor: "background.paper",
                      border: "2px solid #2e7d32",
                      borderRadius: "50%",
                      cursor: "nesw-resize",
                      zIndex: 10,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                  {/* Bottom-right handle */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -12,
                      right: -12,
                      width: 24,
                      height: 24,
                      bgcolor: "background.paper",
                      border: "2px solid #2e7d32",
                      borderRadius: "50%",
                      cursor: "nwse-resize",
                      zIndex: 10,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                </>
              )}
            </Box>

            {/* Crop overlay */}
            {cropMode && cropData.width > 0 && cropData.height > 0 && (
              <CropOverlay
                sx={{
                  left: cropData.x,
                  top: cropData.y,
                  width: cropData.width,
                  height: cropData.height,
                }}
              >
                {/* Crop handles - all sides and corners */}
                <CropHandle position="top" />
                <CropHandle position="right" />
                <CropHandle position="bottom" />
                <CropHandle position="left" />
                <CropHandle position="topLeft" />
                <CropHandle position="topRight" />
                <CropHandle position="bottomLeft" />
                <CropHandle position="bottomRight" />

                {/* Crop dimensions display */}
                <CropDimensions>
                  {Math.round(cropData.width)} × {Math.round(cropData.height)}
                </CropDimensions>
              </CropOverlay>
            )}

            {/* Crop controls */}
            {cropMode && cropData.width > 0 && cropData.height > 0 && (
              <CropControls>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  onClick={handleApplyCrop}
                  size="small"
                >
                  החל חיתוך
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<CloseIcon />}
                  onClick={handleCancelCrop}
                  size="small"
                >
                  בטל
                </Button>
              </CropControls>
            )}

            {/* Frame overlay */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            >
              <Box
                component="img"
                ref={frameRef}
                src={frameUrl || "/placeholder.svg"}
                alt="Frame"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                onLoad={(e) => {
                  // Ensure frame is loaded before showing
                  const img = e.target as HTMLImageElement
                  img.style.display = "block"
                }}
              />
            </Box>

            {/* Animation controls */}
            {activeTool === "animate" && (
              <AnimationControls>
                <AnimationTitle>אנימציה ({animationFrames.length} פריימים)</AnimationTitle>
                <AnimationButtons>
                  <AnimationButton variant="contained" color="primary" size="small" onClick={handleAddAnimationFrame}>
                    + הוסף פריים
                  </AnimationButton>
                  <AnimationButton
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={handleToggleAnimation}
                    disabled={animationFrames.length === 0}
                  >
                    {animationState === "playing" ? "⏸️ השהה" : "▶️ הפעל"}
                  </AnimationButton>
                  <AnimationButton
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={handleCaptureCurrentFrame}
                    disabled={animationState !== "paused"}
                    sx={{
                      opacity: animationState === "paused" ? 1 : 0.5,
                    }}
                  >
                    📸 בחר מצב נוכחי
                  </AnimationButton>
                  <AnimationButton
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={handleClearAnimation}
                    disabled={animationFrames.length === 0}
                  >
                    🗑️ נקה
                  </AnimationButton>
                </AnimationButtons>
                {animationState !== "stopped" && (
                  <AnimationInfo>
                    פריים נוכחי: {currentFrame + 1}/{animationFrames.length}
                  </AnimationInfo>
                )}
              </AnimationControls>
            )}

            {/* Tool indicator */}
            <ToolIndicator
              sx={{
                display: activeTool === "animate" ? "none" : "block",
              }}
            >
              {activeTool === "select" && "כלי בחירה: לחץ על כלי אחר כדי לערוך את התמונה"}
              {activeTool === "move" && "כלי הזזה: גרור את התמונה למיקום הרצוי"}
              {activeTool === "zoom" && "כלי זום: גרור למעלה להגדלה, למטה להקטנה"}
              {activeTool === "rotate" && "כלי סיבוב: גרור לסיבוב התמונה"}
              {activeTool === "resize" && "כלי שינוי גודל: גרור מהפינות לשינוי גודל"}
              {activeTool === "crop" && "כלי חיתוך: גרור ליצירת מסגרת חיתוך או שנה באמצעות הידיות"}
            </ToolIndicator>
          </CanvasArea>

          {/* Right sidebar for controls */}
          <SidePanel variant="persistent" anchor="right" open={showEffectsPanel}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                אפקטים
              </Typography>

              <EffectGrid container spacing={1.5}>
                {[
                  { id: "none", name: "ללא אפקט" },
                  { id: "sepia", name: "ספיה" },
                  { id: "grayscale", name: "שחור-לבן" },
                  { id: "vintage", name: "וינטג'" },
                  { id: "bright", name: "בהיר" },
                  { id: "cool", name: "קריר" },
                  { id: "warm", name: "חמים" },
                ].map((effect) => (
                  <Grid item xs={6} key={effect.id}>
                    <EffectItem active={effectStyle === effect.id} onClick={() => setEffectStyle(effect.id)}>
                      <EffectImage>
                        <Box
                          component="img"
                          src={imageUrl || "/placeholder.svg"}
                          alt={effect.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: getFilterString(effect.id),
                          }}
                        />
                      </EffectImage>
                      <EffectName>{effect.name}</EffectName>
                    </EffectItem>
                  </Grid>
                ))}
              </EffectGrid>

              <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
                התאמות
              </Typography>

              <SliderContainer>
                <SliderLabel>גודל ({Math.round(scale * 100)}%)</SliderLabel>
                <SliderControls>
                  <Slider
                    min={0.1}
                    max={3}
                    step={0.01}
                    value={scale}
                    onChange={(_, value) => setScale(value as number)}
                    color="primary"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    type="number"
                    size="small"
                    inputProps={{ min: 10, max: 300 }}
                    value={Math.round(scale * 100)}
                    onChange={(e) => setScale(Number.parseInt(e.target.value) / 100)}
                    sx={{ width: 70 }}
                  />
                </SliderControls>
              </SliderContainer>

              <SliderContainer>
                <SliderLabel>סיבוב ({Math.round(rotation)}°)</SliderLabel>
                <SliderControls>
                  <Slider
                    min={-180}
                    max={180}
                    step={1}
                    value={rotation}
                    onChange={(_, value) => setRotation(value as number)}
                    color="primary"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    type="number"
                    size="small"
                    inputProps={{ min: -180, max: 180 }}
                    value={Math.round(rotation)}
                    onChange={(e) => setRotation(Number.parseInt(e.target.value))}
                    sx={{ width: 70 }}
                  />
                </SliderControls>
              </SliderContainer>

              <SliderContainer>
                <SliderLabel>מיקום אופקי ({Math.round(positionX)}px)</SliderLabel>
                <SliderControls>
                  <Slider
                    min={-200}
                    max={200}
                    step={1}
                    value={positionX}
                    onChange={(_, value) => setPositionX(value as number)}
                    color="primary"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    type="number"
                    size="small"
                    inputProps={{ min: -200, max: 200 }}
                    value={Math.round(positionX)}
                    onChange={(e) => setPositionX(Number.parseInt(e.target.value))}
                    sx={{ width: 70 }}
                  />
                </SliderControls>
              </SliderContainer>

              <SliderContainer>
                <SliderLabel>מיקום אנכי ({Math.round(positionY)}px)</SliderLabel>
                <SliderControls>
                  <Slider
                    min={-200}
                    max={200}
                    step={1}
                    value={positionY}
                    onChange={(_, value) => setPositionY(value as number)}
                    color="primary"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    type="number"
                    size="small"
                    inputProps={{ min: -200, max: 200 }}
                    value={Math.round(positionY)}
                    onChange={(e) => setPositionY(Number.parseInt(e.target.value))}
                    sx={{ width: 70 }}
                  />
                </SliderControls>
              </SliderContainer>
            </Box>
          </SidePanel>
        </ContentArea>

        {/* Status bar */}
        <StatusBar>
          <Box>
            כלי נבחר:{" "}
            <Typography component="span" fontWeight="medium">
              {activeTool === "select"
                ? "בחירה"
                : activeTool === "move"
                  ? "הזזה"
                  : activeTool === "zoom"
                    ? "זום"
                    : activeTool === "rotate"
                      ? "סיבוב"
                      : activeTool === "resize"
                        ? "שינוי גודל"
                        : activeTool === "crop"
                          ? "חיתוך"
                          : "אנימציה"}
            </Typography>
          </Box>
          <Box>
            גודל:{" "}
            <Typography component="span" fontWeight="medium">
              {Math.round(scale * 100)}%
            </Typography>{" "}
            | סיבוב:{" "}
            <Typography component="span" fontWeight="medium">
              {Math.round(rotation)}°
            </Typography>{" "}
            | מיקום:{" "}
            <Typography component="span" fontWeight="medium">
              {Math.round(positionX)}px, {Math.round(positionY)}px
            </Typography>
          </Box>
        </StatusBar>

        {/* Hidden canvas for saving */}
        <Box component="canvas" ref={canvasRef} sx={{ display: "none" }} />
      </RootContainer>
    </ThemeProvider>
  )
}
