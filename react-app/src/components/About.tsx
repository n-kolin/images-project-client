"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router"
import "../css/AboutPage.css"

const AboutPage = () => {
  const navigate = useNavigate()
  const [visibleElements, setVisibleElements] = useState<number[]>([])
  const [demoStep, setDemoStep] = useState(0)
  const [demoText, setDemoText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showBorder, setShowBorder] = useState(false)
  const [showText, setShowText] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // Demo text for the AI editor simulation
  const demoPrompts = [
    "Add blue border to image",
    "Add text 'Summer Vacation'",
    "Make colors more vibrant",
    "Add vintage filter effect",
  ]

  useEffect(() => {
    // Animate page elements
    const timeouts: number[] = []

    for (let i = 0; i < 8; i++) {
      const timeout = setTimeout(() => {
        setVisibleElements((prev) => [...prev, i])
      }, i * 200)
      timeouts.push(timeout)
    }

    // Load demo image
    imageRef.current = new Image()
    imageRef.current.src = "/placeholder.svg?height=300&width=400"
    imageRef.current.crossOrigin = "anonymous"
    imageRef.current.onload = () => {
      drawImageOnCanvas()
    }

    // Start demo after page loads
    const demoTimeout = setTimeout(() => {
      startDemo()
    }, 2000)

    timeouts.push(demoTimeout)

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  // Draw the image on canvas
  const drawImageOnCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw image
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height)

    // Draw blue border if needed
    if (showBorder) {
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 20
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)
    }

    // Draw text if needed
    if (showText) {
      ctx.font = "bold 36px Inter"
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Text shadow for better visibility
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)"
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      ctx.fillText("Summer Vacation", canvas.width / 2, canvas.height / 2)

      // Reset shadow
      ctx.shadowColor = "transparent"
    }
  }

  // Handle demo steps
  useEffect(() => {
    drawImageOnCanvas()
  }, [showBorder, showText])

  const startDemo = () => {
    const currentPrompt = demoPrompts[demoStep % demoPrompts.length]
    setIsTyping(true)
    setDemoText("")

    // Typing animation
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < currentPrompt.length) {
        setDemoText(currentPrompt.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)

        // Show processing overlay
        setTimeout(() => {
          // Apply the effect based on the current step
          if (demoStep % demoPrompts.length === 0) {
            setShowBorder(true)
          } else if (demoStep % demoPrompts.length === 1) {
            setShowText(true)
          }

          // Move to next step after 3 seconds
          setTimeout(() => {
            setDemoStep((prev) => prev + 1)

            // Reset effects if we're starting over
            if ((demoStep + 1) % demoPrompts.length === 0) {
              setShowBorder(false)
              setShowText(false)
            }

            startDemo()
          }, 3000)
        }, 1500)
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
            <div className="demo-explanation">
              <h3>Real-time AI Image Editing</h3>
              <p>
                Our AI editor understands natural language commands and applies them to your images in real-time. Simply
                describe what you want to change, and watch as the AI transforms your image accordingly.
              </p>
              <div className="demo-steps">
                <div className="demo-step">
                  <div className="step-number">1</div>
                  <div className="step-text">Type your editing request</div>
                </div>
                <div className="demo-step">
                  <div className="step-number">2</div>
                  <div className="step-text">AI processes your request</div>
                </div>
                <div className="demo-step">
                  <div className="step-number">3</div>
                  <div className="step-text">See results instantly</div>
                </div>
              </div>
            </div>

            <div className="demo-image-container">
              <canvas ref={canvasRef} width="400" height="300" className="demo-canvas"></canvas>
              <div className={`demo-overlay ${demoStep % 2 === 0 && isTyping === false ? "visible" : ""}`}>
                <div className="ai-processing">
                  <div className="ai-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9 12l2 2 4-4" />
                      <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                      <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                    </svg>
                  </div>
                  <span>AI Processing...</span>
                </div>
              </div>
            </div>

            <div className="demo-controls">
              <div className="demo-input-container">
                <input
                  type="text"
                  value={demoText}
                  placeholder="Describe your edit..."
                  className="demo-input"
                  readOnly
                />
                <div className={`typing-cursor ${isTyping ? "active" : ""}`}></div>
              </div>
              <button className="demo-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Apply Edit
              </button>
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
                <strong>How it works:</strong> Our AI analyzes your image and the text command, then applies appropriate
                transformations. The system supports borders, text overlays, color adjustments, filters, and much more -
                all through simple text commands.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={`features-detailed ${visibleElements.includes(6) ? "visible" : ""}`}>
          <h2 className="section-title">Powerful Editing Features</h2>
          <div className="features-list">
            <div className={`feature-item ${visibleElements.includes(7) ? "visible" : ""}`}>
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

            <div className={`feature-item ${visibleElements.includes(7) ? "visible" : ""}`}>
              <div className="feature-icon-small">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <div className="feature-content">
                <h4>Smart Object Removal</h4>
                <p>Easily remove unwanted objects or people from your images with AI-powered content-aware fill.</p>
              </div>
            </div>

            <div className={`feature-item ${visibleElements.includes(7) ? "visible" : ""}`}>
              <div className="feature-icon-small">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v8m0 4v8M4.93 4.93l5.66 5.66m2.83 2.83l5.66 5.66M2 12h8m4 0h8M4.93 19.07l5.66-5.66m2.83-2.83l5.66-5.66" />
                </svg>
              </div>
              <div className="feature-content">
                <h4>Color Correction</h4>
                <p>Adjust brightness, contrast, saturation, and apply color filters with natural language.</p>
              </div>
            </div>

            <div className={`feature-item ${visibleElements.includes(7) ? "visible" : ""}`}>
              <div className="feature-icon-small">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="feature-content">
                <h4>Natural Language</h4>
                <p>Edit images using simple, natural language commands - no technical skills required.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Code Explanation */}
        <section className={`code-explanation ${visibleElements.includes(5) ? "visible" : ""}`}>
          <h2 className="section-title">How The Code Works</h2>

          <div className="code-block">
            <h3>Canvas-Based Image Editing</h3>
            <p>
              Our demo uses HTML5 Canvas to manipulate images in real-time. Here's how the core functionality works:
            </p>
            <pre className="code-snippet">
              {`// Draw the image on canvas
const drawImageOnCanvas = () => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw image
  ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
  
  // Draw blue border if needed
  if (showBorder) {
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  }
  
  // Draw text if needed
  if (showText) {
    ctx.font = "bold 36px Inter";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("Summer Vacation", canvas.width / 2, canvas.height / 2);
  }
}`}
            </pre>
          </div>

          <div className="code-block">
            <h3>Animation and Timing</h3>
            <p>The demo uses React's useState and useEffect hooks to manage state and timing:</p>
            <pre className="code-snippet">
              {`// Typing animation
let currentIndex = 0;
const typingInterval = setInterval(() => {
  if (currentIndex < currentPrompt.length) {
    setDemoText(currentPrompt.slice(0, currentIndex + 1));
    currentIndex++;
  } else {
    clearInterval(typingInterval);
    setIsTyping(false);
    
    // Show processing overlay
    setTimeout(() => {
      // Apply the effect based on the current step
      if (demoStep % demoPrompts.length === 0) {
        setShowBorder(true);
      } else if (demoStep % demoPrompts.length === 1) {
        setShowText(true);
      }
      
      // Move to next step after 3 seconds
      setTimeout(() => {
        setDemoStep((prev) => prev + 1);
        startDemo();
      }, 3000);
    }, 1500);
  }
}, 100);`}
            </pre>
          </div>

          <div className="code-block">
            <h3>Scroll-Triggered Animations</h3>
            <p>Elements appear as you scroll using CSS transitions and React state:</p>
            <pre className="code-snippet">
              {`// CSS for scroll animations
.features-detailed {
  opacity: 0;
  transform: translateY(60px);
  transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.features-detailed.visible {
  opacity: 1;
  transform: translateY(0);
}

// React code to trigger animations
useEffect(() => {
  const timeouts = [];
  for (let i = 0; i < 8; i++) {
    const timeout = setTimeout(() => {
      setVisibleElements((prev) => [...prev, i]);
    }, i * 200);
    timeouts.push(timeout);
  }
  
  return () => {
    timeouts.forEach((timeout) => clearTimeout(timeout));
  };
}, []);`}
            </pre>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
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

export default AboutPage
