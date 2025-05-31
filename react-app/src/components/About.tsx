"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router"
import "../css/About.css"

interface ImageFilters {
  transform?: {
    rotation?: number
    scale?: number
    flipX?: boolean
    flipY?: boolean
  }
  crop?: {
    x: number
    y: number
    width: number
    height: number
  }
  filter?: {
    brightness?: number
    contrast?: number
    saturation?: number
    blur?: number
    grayscale?: number
  }
  overlay?: {
    color: string
    blendMode: string
  }
  border?: {
    width: number
    color: string
    style: string
  }
  shadow?: {
    offsetX: number
    offsetY: number
    blur: number
    color: string
  }
  textLayer?: {
    text: string
    x: number
    y: number
    fontSize: number
    color: string
    fontFamily?: string
    fontWeight?: string
    textAlign?: string
  }
}

const About = () => {
  const navigate = useNavigate()
  const [visibleElements, setVisibleElements] = useState<number[]>([])
  const [demoStep, setDemoStep] = useState(0)
  const [demoText, setDemoText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<ImageFilters>({})
  const [chatMessages, setChatMessages] = useState<string[]>([])
  const [currentTypingMessage, setCurrentTypingMessage] = useState("")
  const [isTypingMessage, setIsTypingMessage] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // URL של התמונה שתוצג
  const imageUrl = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"

  // Demo commands that build upon each other
  const demoCommands = [
    {
      text: "Add blue border to image",
      filters: {
        border: {
          width: 20,
          color: "#3b82f6",
          style: "solid",
        },
      },
      response: "Perfect! I'm adding a beautiful blue border to your image. This will help frame the content nicely.",
    },
    {
      text: "Add text 'Summer Vacation'",
      filters: {
        textLayer: {
          text: "Summer Vacation",
          x: 200,
          y: 150,
          fontSize: 36,
          color: "#ffffff",
          fontFamily: "Inter",
          fontWeight: "bold",
          textAlign: "center",
        },
      },
      response:
        "Great idea! Adding 'Summer Vacation' text to your image. I'll place it in the center with a nice white color.",
    },
    {
      text: "Make text larger and golden",
      filters: {
        textLayer: {
          text: "Summer Vacation",
          x: 200,
          y: 150,
          fontSize: 48,
          color: "#ffd700",
          fontFamily: "Inter",
          fontWeight: "bold",
          textAlign: "center",
        },
      },
      response:
        "Excellent choice! Making the text larger and changing it to a beautiful golden color. This will make it really stand out!",
    },
    {
      text: "Add shadow to text",
      filters: {
        shadow: {
          offsetX: 3,
          offsetY: 3,
          blur: 8,
          color: "rgba(0, 0, 0, 0.7)",
        },
      },
      response:
        "Adding a subtle shadow effect to the text. This will give it more depth and make it easier to read against any background.",
    },
    {
      text: "Increase brightness",
      filters: {
        filter: {
          brightness: 1.3,
          contrast: 1.1,
        },
      },
      response:
        "Brightening up the entire image and adding some contrast. This will make the colors more vibrant and the image more appealing!",
    },
  ]

  useEffect(() => {
    // Animate elements one by one
    const timeouts: number[] = []

    for (let i = 0; i < 6; i++) {
      const timeout = setTimeout(() => {
        setVisibleElements((prev) => [...prev, i])
      }, i * 300)
      timeouts.push(timeout)
    }

    // Load demo image
    loadImage()

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  const loadImage = () => {
    imageRef.current = new Image()
    imageRef.current.src = imageUrl
    imageRef.current.crossOrigin = "anonymous"
    imageRef.current.onload = () => {
      drawImageOnCanvas()
      // Start demo after image loads
      setTimeout(() => {
        startDemo()
      }, 1000)
    }
    imageRef.current.onerror = () => {
      drawFallbackImage()
      // Start demo even if image fails to load
      setTimeout(() => {
        startDemo()
      }, 1000)
    }
  }

  const drawFallbackImage = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw a gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#87ceeb")
    gradient.addColorStop(0.5, "#98d8e8")
    gradient.addColorStop(1, "#f0f8ff")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw mountains
    ctx.fillStyle = "#8b7355"
    ctx.beginPath()
    ctx.moveTo(0, canvas.height * 0.7)
    ctx.lineTo(canvas.width * 0.3, canvas.height * 0.4)
    ctx.lineTo(canvas.width * 0.7, canvas.height * 0.5)
    ctx.lineTo(canvas.width, canvas.height * 0.6)
    ctx.lineTo(canvas.width, canvas.height * 0.7)
    ctx.closePath()
    ctx.fill()

    // Draw ground
    ctx.fillStyle = "#90ee90"
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3)

    // Draw sun
    ctx.fillStyle = "#ffd700"
    ctx.beginPath()
    ctx.arc(canvas.width * 0.8, canvas.height * 0.25, 25, 0, Math.PI * 2)
    ctx.fill()

    applyFiltersToCanvas(ctx, canvas)
  }

  const drawImageOnCanvas = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!imageRef.current) {
      drawFallbackImage()
      return
    }

    try {
      // Apply filters first
      if (appliedFilters.filter) {
        const { brightness = 1, contrast = 1, saturation = 1, blur = 0, grayscale = 0 } = appliedFilters.filter
        ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) blur(${blur}px) grayscale(${grayscale})`
      }

      // Draw image
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height)

      // Reset filter
      ctx.filter = "none"
    } catch (error) {
      console.warn("Error drawing image, using fallback:", error)
      drawFallbackImage()
      return
    }

    applyFiltersToCanvas(ctx, canvas)
  }

  const applyFiltersToCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Apply border
    if (appliedFilters.border) {
      const { width, color, style } = appliedFilters.border
      ctx.strokeStyle = color
      ctx.lineWidth = width
      if (style === "dashed") {
        ctx.setLineDash([10, 5])
      } else {
        ctx.setLineDash([])
      }
      ctx.strokeRect(width / 2, width / 2, canvas.width - width, canvas.height - width)
    }

    // Apply text with shadow
    if (appliedFilters.textLayer) {
      const {
        text,
        x,
        y,
        fontSize,
        color,
        fontFamily = "Inter",
        fontWeight = "normal",
        textAlign = "center",
      } = appliedFilters.textLayer

      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}, Arial, sans-serif`
      ctx.fillStyle = color
      ctx.textAlign = textAlign as CanvasTextAlign
      ctx.textBaseline = "middle"

      // Apply shadow if exists
      if (appliedFilters.shadow) {
        const { offsetX, offsetY, blur, color: shadowColor } = appliedFilters.shadow
        ctx.shadowColor = shadowColor
        ctx.shadowBlur = blur
        ctx.shadowOffsetX = offsetX
        ctx.shadowOffsetY = offsetY
      }

      ctx.fillText(text, x, y)

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    }

    // Apply overlay
    if (appliedFilters.overlay) {
      const { color, blendMode } = appliedFilters.overlay
      ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation
      ctx.fillStyle = color
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = "source-over"
    }
  }

  useEffect(() => {
    drawImageOnCanvas()
  }, [appliedFilters])

  const typeMessage = (message: string, callback: () => void) => {
    setIsTypingMessage(true)
    setCurrentTypingMessage("")

    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < message.length) {
        setCurrentTypingMessage(message.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsTypingMessage(false)
        // Add to chat messages
        setChatMessages((prev) => [...prev, message])
        setCurrentTypingMessage("")
        callback()
      }
    }, 50) // Faster typing speed
  }

  const startDemo = () => {
    if (demoStep >= demoCommands.length) {
      // Reset and start over
      setAppliedFilters({})
      setChatMessages([])
      setDemoStep(0)
      setTimeout(() => {
        runNextDemoStep(0)
      }, 2000)
      return
    }

    runNextDemoStep(demoStep)
  }

  const runNextDemoStep = (step: number) => {
    const currentCommand = demoCommands[step]
    setIsTyping(true)
    setDemoText("")

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }

    // Typing animation for input
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < currentCommand.text.length) {
        setDemoText(currentCommand.text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)

        // Show processing state
        setTimeout(() => {
          setIsProcessing(true)

          // Type the response message
          setTimeout(() => {
            typeMessage(currentCommand.response, () => {
              // Apply the filters after message is typed
              setTimeout(() => {
                setAppliedFilters((prev) => ({
                  ...prev,
                  ...currentCommand.filters,
                }))

                setIsProcessing(false)

                // Wait longer before next step to let users read the message
                setTimeout(() => {
                  setDemoStep(step + 1)
                  if (step + 1 < demoCommands.length) {
                    runNextDemoStep(step + 1)
                  } else {
                    // Wait longer before resetting
                    setTimeout(() => {
                      startDemo()
                    }, 4000)
                  }
                }, 3000) // Increased wait time
              }, 1000)
            })
          }, 500)
        }, 1000)
      }
    }, 100)
  }

  const handleGetStarted = () => {
    navigate("/files")
  }

  return (
    <div className="about-page">
      <div className="about-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      <div className="about-container">
        {/* Header */}
        <section className={`about-header ${visibleElements.includes(0) ? "visible" : ""}`}>
          <h1 className="about-title">How Our AI Editor Works</h1>
          <p className="about-subtitle">Experience the power of AI-driven image editing with simple text commands</p>
        </section>

        {/* Demo Section */}
        <section className={`demo-section ${visibleElements.includes(1) ? "visible" : ""}`}>
          <div className="demo-container">
            <div className="image-editor-header">
              <h1>Image Editor</h1>
            </div>

            <div className="demo-layout">
              {/* Left Side - Image */}
              <div className="demo-image-side">
                <div className="demo-image-container">
                  <canvas ref={canvasRef} width="400" height="300" className="demo-canvas"></canvas>
                </div>

                <div className="ai-design-tool">
                  <h2 className="ai-tool-title">AI Image Editor</h2>

                  <div className="ai-form">
                    <div className="input-container">
                      <textarea
                        ref={textareaRef}
                        value={demoText}
                        placeholder="Describe your edit..."
                        className="ai-textarea"
                        readOnly
                      />
                    </div>
                    <button
                      className={`ai-submit-button ${isProcessing ? "loading" : ""}`}
                      disabled={isProcessing || isTyping}
                    >
                      {isProcessing ? "" : "Apply Edit"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Chat */}
              <div className="demo-chat-side">
                <div className="chat-header">
                  <h3>AI Assistant</h3>
                  <div className="chat-status">
                    <div className="status-dot"></div>
                    <span>Online</span>
                  </div>
                </div>

                <div className="chat-messages">
                  {chatMessages.map((message, index) => (
                    <div key={index} className="chat-message-item">
                      <div className="message-avatar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M9 12l2 2 4-4" />
                          <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                          <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                        </svg>
                      </div>
                      <div className="message-content">
                        <div className="message-text">{message}</div>
                      </div>
                    </div>
                  ))}

                  {isTypingMessage && (
                    <div className="chat-message-item typing">
                      <div className="message-avatar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M9 12l2 2 4-4" />
                          <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                          <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                        </svg>
                      </div>
                      <div className="message-content">
                        <div className="message-text">
                          {currentTypingMessage}
                          <span className="typing-cursor">|</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="demo-info">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <p>
                <strong>Progressive Editing:</strong> Watch how each command builds upon the previous ones. The AI
                assistant guides you through each step, explaining what it's doing and why.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={`features-detailed ${visibleElements.includes(2) ? "visible" : ""}`}>
          <h2 className="section-title">Powerful Editing Features</h2>
          <div className="features-list">
            <div className={`feature-item ${visibleElements.includes(3) ? "visible" : ""}`}>
              <div className="feature-icon-small">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21,15 16,10 5,21" />
                </svg>
              </div>
              <div className="feature-content">
                <h4>Visual Enhancements</h4>
                <p>Add borders, frames, text overlays, and visual effects with simple text commands.</p>
              </div>
            </div>

            <div className={`feature-item ${visibleElements.includes(3) ? "visible" : ""}`}>
              <div className="feature-icon-small">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="feature-content">
                <h4>Progressive Editing</h4>
                <p>Build complex edits step by step. Each command enhances and builds upon previous changes.</p>
              </div>
            </div>

            <div className={`feature-item ${visibleElements.includes(3) ? "visible" : ""}`}>
              <div className="feature-icon-small">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v8m0 4v8M4.93 4.93l5.66 5.66m2.83 2.83l5.66 5.66M2 12h8m4 0h8M4.93 19.07l5.66-5.66m2.83-2.83l5.66-5.66" />
                </svg>
              </div>
              <div className="feature-content">
                <h4>Smart Filters</h4>
                <p>Apply brightness, contrast, saturation adjustments and creative filters with natural language.</p>
              </div>
            </div>

            <div className={`feature-item ${visibleElements.includes(3) ? "visible" : ""}`}>
              <div className="feature-icon-small">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <div className="feature-content">
                <h4>Text & Typography</h4>
                <p>Add text with custom fonts, sizes, colors, and effects. Modify existing text easily.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`cta-section ${visibleElements.includes(4) ? "visible" : ""}`}>
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Images?</h2>
            <p className="cta-description">
              Experience the power of AI-driven image editing with our intuitive platform.
            </p>
            <button className="cta-button-large" onClick={handleGetStarted}>
              <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Start Editing Now
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
