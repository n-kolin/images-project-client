"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import "../css/Home.css"

const Home = () => {
  const navigate = useNavigate()
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    images: 0,
    edits: 0,
  })
  const [statsAnimated, setStatsAnimated] = useState(false)
  const statsSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const targetUsers = 2847
    const targetImages = 156420
    const targetEdits = 89340

    if (statsAnimated) {
      const duration = 2000
      let startTime: number | null = null

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = (currentTime - startTime) / duration

        if (progress < 1) {
          setAnimatedStats({
            users: Math.min(targetUsers, Math.floor(targetUsers * progress)),
            images: Math.min(targetImages, Math.floor(targetImages * progress)),
            edits: Math.min(targetEdits, Math.floor(targetEdits * progress)),
          })
          requestAnimationFrame(animate)
        } else {
          setAnimatedStats({
            users: targetUsers,
            images: targetImages,
            edits: targetEdits,
          })
        }
      }

      requestAnimationFrame(animate)
    }
  }, [statsAnimated])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            setStatsAnimated(true)
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.5,
      },
    )

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current)
    }

    return () => {
      if (statsSectionRef.current) {
        observer.unobserve(statsSectionRef.current)
      }
    }
  }, [statsAnimated])

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
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-line">Revolutionize Your</span>
              <span className="title-line gradient-text">Image Management</span>
              <span className="title-line">with AI-Powered Editing</span>
            </h1>
            <p className="hero-subtitle">
              Experience the future of digital asset management. Upload your images to secure AWS S3 storage, organize
              them in intuitive hierarchical folders, and transform them with cutting-edge AI technology. Simply
              describe your vision in plain text, and watch as our intelligent system converts your words into precise
              canvas modifications - from elegant borders and custom text overlays to sophisticated visual effects.
            </p>
            <div className="hero-buttons">
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

        <section className="features-section">
          <h2 className="section-title colorful-text">Complete Image Management Solution</h2>
          <p className="section-subtitle">
            Everything you need to store, organize, and enhance your digital images in one powerful platform
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <h3 className="feature-title colorful-text">Seamless Upload & Storage</h3>
              <p className="feature-description">
                Quick drag-and-drop uploads to secure AWS S3 storage. Create custom folder structures to keep your
                digital assets organized and accessible anytime.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                  <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                </svg>
              </div>
              <h3 className="feature-title colorful-text">AI-Powered Text-to-Edit</h3>
              <p className="feature-description">
                Transform images with simple text commands. Add borders, text, and effects by describing what you want.
                Our AI converts your words into precise canvas edits instantly.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="feature-title colorful-text">Hierarchical Organization</h3>
              <p className="feature-description">
                Create nested folders to organize your images logically. Easily move, download, or delete files as
                needed while maintaining perfect organization across your entire collection.
              </p>
            </div>
          </div>
        </section>

        <section className="stats-section" ref={statsSectionRef}>
          <div className="stats-container">
            <h2 className="stats-title colorful-text">Trusted by Thousands of Users Worldwide</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number animated-stat">{animatedStats.users.toLocaleString()}+</div>
                <div className="stat-label">Active Users</div>
                <div className="stat-description">Creative professionals trust our platform</div>
              </div>
              <div className="stat-item">
                <div className="stat-number animated-stat">{animatedStats.images.toLocaleString()}+</div>
                <div className="stat-label">Images Stored</div>
                <div className="stat-description">Safely managed in AWS S3</div>
              </div>
              <div className="stat-item">
                <div className="stat-number animated-stat">{animatedStats.edits.toLocaleString()}+</div>
                <div className="stat-label">AI Edits Completed</div>
                <div className="stat-description">Powered by intelligent text processing</div>
              </div>
            </div>
          </div>
        </section>

        <section className="how-it-works-section">
          <h2 className="section-title colorful-text">How Our Platform Works</h2>
          <p className="section-subtitle">
            From upload to AI-powered editing, experience a streamlined workflow designed for modern creators
          </p>
          <div className="steps-container">
            <div className="step-item step-left">
              <div className="step-number colorful-number">01</div>
              <div className="step-content">
                <h3 className="step-title colorful-text">Upload & Organize</h3>
                <p className="step-description">
                  Start by uploading your images through our intuitive interface. Create custom folder structures that
                  match your workflow. Your files are instantly secured in AWS S3 with enterprise-grade encryption and
                  redundancy across multiple data centers.
                </p>
              </div>
            </div>
            <div className="step-item step-right">
              <div className="step-number colorful-number">02</div>
              <div className="step-content">
                <h3 className="step-title colorful-text">Select & Edit</h3>
                <p className="step-description">
                  Choose any image from your collection and enter our AI editing environment. Simply describe your
                  desired changes in plain English - add borders, insert text, apply filters, or create custom visual
                  effects. Our AI interprets your commands and generates precise canvas code.
                </p>
              </div>
            </div>
            <div className="step-item step-left">
              <div className="step-number colorful-number">03</div>
              <div className="step-content">
                <h3 className="step-title colorful-text">Download & Share</h3>
                <p className="step-description">
                  Once you're satisfied with your edits, download your enhanced images in high quality. Share them
                  directly or continue organizing them in your folder structure. Every edit preserves the original file,
                  so you can always return to your starting point.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="benefits-section">
          <div className="benefits-container">
            <div className="benefits-content">
              <h2 className="section-title colorful-text">Why Choose Our Platform?</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="benefit-content">
                    <h3 className="colorful-text">Enterprise Security</h3>
                    <p>
                      Your images are protected with AWS S3's military-grade security, ensuring your creative assets
                      remain safe and accessible only to you.
                    </p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div className="benefit-content">
                    <h3 className="colorful-text">Lightning Fast</h3>
                    <p>
                      Experience instant uploads, real-time AI processing, and seamless file management that keeps pace
                      with your creative workflow.
                    </p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="benefit-content">
                    <h3 className="colorful-text">Unlimited Scalability</h3>
                    <p>
                      From personal projects to enterprise portfolios, our platform grows with your needs without
                      compromising performance.
                    </p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9 12l2 2 4-4" />
                      <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                    </svg>
                  </div>
                  <div className="benefit-content">
                    <h3 className="colorful-text">Intuitive AI</h3>
                    <p>
                      Our advanced AI understands natural language, making complex image editing as simple as describing
                      what you want to achieve.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="final-cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Images?</h2>
            <p className="cta-description">
              Experience the power of AI-driven image editing with our intuitive platform.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
