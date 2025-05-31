"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import "../css/Home.css"

const Home = () => {
  const navigate = useNavigate()
  const [visibleElements, setVisibleElements] = useState<number[]>([])

  useEffect(() => {


    const timeouts: number[] = []

    
    for (let i = 0; i < 6; i++) {
      const timeout = setTimeout(() => {
        setVisibleElements((prev) => [...prev, i])
      }, i * 300)
      timeouts.push(timeout)
    }

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  const handleGetStarted = () => {
    navigate("/files")
  }

  const handleLearnMore = () => {
    navigate("/about")
  }

  return (
    <div className="home-page">
      <div className="home-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-orb orb-4"></div>
        <div className="floating-orb orb-5"></div>
      </div>

      <div className="home-container">
        {/* Hero Section */}
        <section className={`hero-section ${visibleElements.includes(0) ? "visible" : ""}`}>
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-line">Transform Your</span>
              <span className="title-line gradient-text">Digital Assets</span>
              <span className="title-line">with AI Power</span>
            </h1>
            <p className="hero-subtitle">
              Upload, organize, and edit your images with cutting-edge AI technology. Experience the future of file
              management and image editing in one powerful platform.
            </p>
            <div className="hero-buttons">
              <button className="cta-button primary" onClick={handleGetStarted}>
                <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Get Started
              </button>
              <button className="cta-button secondary" onClick={handleLearnMore}>
                <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className={`features-section ${visibleElements.includes(1) ? "visible" : ""}`}>
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className={`feature-card ${visibleElements.includes(2) ? "visible" : ""}`}>
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <h3 className="feature-title">Smart Upload</h3>
              <p className="feature-description">
                Drag and drop your files with intelligent organization and automatic categorization.
              </p>
            </div>

            <div className={`feature-card ${visibleElements.includes(3) ? "visible" : ""}`}>
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                  <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                  <path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                  <path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                </svg>
              </div>
              <h3 className="feature-title">AI-Powered Editing</h3>
              <p className="feature-description">
                Transform your images with advanced AI algorithms that understand your creative vision.
              </p>
            </div>

            <div className={`feature-card ${visibleElements.includes(4) ? "visible" : ""}`}>
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="feature-title">Smart Organization</h3>
              <p className="feature-description">
                Create folders, tag files, and find everything instantly with our powerful search engine.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={`stats-section ${visibleElements.includes(5) ? "visible" : ""}`}>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Images Processed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5sec</div>
              <div className="stat-label">Average Processing</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/6</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
