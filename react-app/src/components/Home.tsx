"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router"
import "../css/Home.css"

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
}

const Home = () => {
  const navigate = useNavigate()
  const [visibleElements, setVisibleElements] = useState<number[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
  })
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    images: 0,
    edits: 0,
  })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [tempRating, setTempRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSignIn, setIsSignIn] = useState(false)

  // Refs for scroll animation
  const featuresRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLElement>(null)
  const testimonialsRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)
  const benefitsRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  // Target values for animated stats
  const targetStats = {
    users: 2847,
    images: 156420,
    edits: 89340,
  }

  useEffect(() => {
    // Load testimonials from localStorage
    const savedTestimonials = localStorage.getItem("testimonials")
    if (savedTestimonials) {
      setTestimonials(JSON.parse(savedTestimonials))
    } else {
      // Default testimonials - reduced to 10 total
      const defaultTestimonials: Testimonial[] = [
        {
          id: 1,
          name: "David Cohen",
          role: "Graphic Designer",
          content:
            "The AI editing feature is incredible! I can transform my images with simple text commands. It's like having a professional editor at my fingertips.",
          rating: 5,
        },
        {
          id: 2,
          name: "Noa Levi",
          role: "Photography Studio Owner",
          content:
            "Managing thousands of client photos has never been easier. The hierarchical folder system and AWS integration give me peace of mind.",
          rating: 5,
        },
        {
          id: 3,
          name: "Yael Goldstein",
          role: "Social Media Manager",
          content:
            "I love how I can quickly upload, organize, and edit images for multiple campaigns. The AI understands exactly what I want to achieve.",
          rating: 4,
        },
        {
          id: 4,
          name: "Avi Mizrachi",
          role: "Web Developer",
          content:
            "The integration with AWS S3 is seamless. I can easily manage all my client website assets in one place and edit them on the fly.",
          rating: 5,
        },
        {
          id: 5,
          name: "Tamar Shapira",
          role: "E-commerce Owner",
          content:
            "This platform has cut my product image editing time in half. The folder organization helps me keep track of thousands of product photos.",
          rating: 4,
        },
        {
          id: 6,
          name: "Moshe Levy",
          role: "Marketing Director",
          content:
            "The ability to quickly edit and organize campaign assets has transformed our workflow. The AI editing is surprisingly accurate.",
          rating: 5,
        },
        {
          id: 7,
          name: "Shira Ben-David",
          role: "Freelance Photographer",
          content:
            "I've tried many image management tools, but this one stands out for its intuitive organization and powerful AI editing capabilities.",
          rating: 5,
        },
        {
          id: 8,
          name: "Daniel Katz",
          role: "Content Creator",
          content:
            "The text-to-edit feature is a game-changer for someone who isn't technically skilled with design software. I just describe what I want, and it happens!",
          rating: 4,
        },
        {
          id: 9,
          name: "Maya Rosenberg",
          role: "Digital Artist",
          content:
            "Having all my work organized in hierarchical folders while being able to quickly apply edits has streamlined my entire creative process.",
          rating: 5,
        },
        {
          id: 10,
          name: "Ronen Avraham",
          role: "UI/UX Designer",
          content:
            "The hierarchical folder system is perfect for organizing my design assets. I can quickly find what I need and apply AI edits without switching between applications.",
          rating: 5,
        },
      ]
      setTestimonials(defaultTestimonials)
      localStorage.setItem("testimonials", JSON.stringify(defaultTestimonials))
    }
  }, [])

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === featuresRef.current) {
            setTimeout(() => setVisibleElements((prev) => [...prev, 1]), 200)
            setTimeout(() => setVisibleElements((prev) => [...prev, 2]), 600)
            setTimeout(() => setVisibleElements((prev) => [...prev, 3]), 1000)
          }
          if (entry.target === statsRef.current) {
            setTimeout(() => setVisibleElements((prev) => [...prev, 4]), 200)
            animateStats()
          }
          if (entry.target === howItWorksRef.current) {
            setTimeout(() => setVisibleElements((prev) => [...prev, 5]), 200)
            // Steps animation - sequential with faster timing
            setTimeout(() => setVisibleElements((prev) => [...prev, 6]), 300) // Step 1 from left
            setTimeout(() => setVisibleElements((prev) => [...prev, 7]), 500) // Step 2 from right
            setTimeout(() => setVisibleElements((prev) => [...prev, 8]), 700) // Step 3 from left
          }
          if (entry.target === benefitsRef.current) {
            setTimeout(() => setVisibleElements((prev) => [...prev, 9]), 200)
            setTimeout(() => setVisibleElements((prev) => [...prev, 10]), 600)
          }
          if (entry.target === testimonialsRef.current) {
            setTimeout(() => setVisibleElements((prev) => [...prev, 11]), 200)
            setTimeout(() => setVisibleElements((prev) => [...prev, 12]), 600)
          }
          if (entry.target === ctaRef.current) {
            setTimeout(() => setVisibleElements((prev) => [...prev, 13]), 200)
          }
        }
      })
    }, observerOptions)

    if (featuresRef.current) observer.observe(featuresRef.current)
    if (statsRef.current) observer.observe(statsRef.current)
    if (howItWorksRef.current) observer.observe(howItWorksRef.current)
    if (benefitsRef.current) observer.observe(benefitsRef.current)
    if (testimonialsRef.current) observer.observe(testimonialsRef.current)
    if (ctaRef.current) observer.observe(ctaRef.current)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Animate initial hero section
    setTimeout(() => setVisibleElements([0]), 300)
  }, [])

  const animateStats = () => {
    const duration = 2500 // Reduced from 4000 to 2500 milliseconds
    const steps = 120 // More steps for smoother animation
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedStats({
        users: Math.floor(targetStats.users * progress),
        images: Math.floor(targetStats.images * progress),
        edits: Math.floor(targetStats.edits * progress),
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedStats(targetStats)
      }
    }, stepDuration)
  }

  const handleGetStarted = () => {
    setShowAuthModal(true)
    setIsSignIn(false) // Open sign up form
  }

  const handleLearnMore = () => {
    navigate("/about")
  }

  const handleStarClick = (rating: number) => {
    setNewTestimonial({ ...newTestimonial, rating })
    setTempRating(rating)
  }

  const handleStarHover = (rating: number) => {
    setHoverRating(rating)
  }

  const handleStarLeave = () => {
    setHoverRating(0)
  }

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTestimonial.name || !newTestimonial.content) return

    const testimonial: Testimonial = {
      id: Date.now(),
      ...newTestimonial,
    }

    const updatedTestimonials = [...testimonials, testimonial]
    setTestimonials(updatedTestimonials)
    localStorage.setItem("testimonials", JSON.stringify(updatedTestimonials))

    setNewTestimonial({ name: "", role: "", content: "", rating: 5 })
    setShowTestimonialForm(false)
  }

  // Get current 3 testimonials for sliding window
  const getCurrentTestimonials = () => {
    if (!testimonials || testimonials.length === 0) {
      return []
    }

    const result = []
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % testimonials.length
      if (testimonials[index]) {
        result.push(testimonials[index])
      }
    }
    return result
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonials = getCurrentTestimonials()

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

        {/* Features Section */}
        <section ref={featuresRef} className={`features-section ${visibleElements.includes(1) ? "visible" : ""}`}>
          <h2 className="section-title colorful-text">Complete Image Management Solution</h2>
          <p className="section-subtitle">
            Everything you need to store, organize, and enhance your digital images in one powerful platform
          </p>
          <div className="features-grid">
            <div className={`feature-card ${visibleElements.includes(2) ? "visible" : ""}`}>
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

            <div className={`feature-card ${visibleElements.includes(2) ? "visible" : ""}`}>
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

            <div className={`feature-card ${visibleElements.includes(2) ? "visible" : ""}`}>
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

        {/* Stats Section */}
        <section ref={statsRef} className={`stats-section ${visibleElements.includes(4) ? "visible" : ""}`}>
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

        {/* How It Works Section */}
        <section ref={howItWorksRef} className={`how-it-works-section ${visibleElements.includes(5) ? "visible" : ""}`}>
          <h2 className="section-title colorful-text">How Our Platform Works</h2>
          <p className="section-subtitle">
            From upload to AI-powered editing, experience a streamlined workflow designed for modern creators
          </p>
          <div className="steps-container">
            {/* Step 1 - Left aligned */}
            <div className={`step-item step-left ${visibleElements.includes(6) ? "visible" : ""}`}>
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

            {/* Step 2 - Right aligned */}
            <div className={`step-item step-right ${visibleElements.includes(7) ? "visible" : ""}`}>
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

            {/* Step 3 - Left aligned */}
            <div className={`step-item step-left ${visibleElements.includes(8) ? "visible" : ""}`}>
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

        {/* Benefits Section */}
        <section ref={benefitsRef} className={`benefits-section ${visibleElements.includes(9) ? "visible" : ""}`}>
          <div className="benefits-container">
            <div className="benefits-content">
              <h2 className="section-title colorful-text">Why Choose Our Platform?</h2>
              <div className={`benefits-list ${visibleElements.includes(10) ? "visible" : ""}`}>
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

        {/* Testimonials Section */}
        <section
          ref={testimonialsRef}
          className={`testimonials-section ${visibleElements.includes(11) ? "visible" : ""}`}
        >
          <h2 className="section-title colorful-text">What Our Users Say</h2>
          <div className="testimonials-slider">
            <button
              className="slider-arrow slider-arrow-left"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              disabled={testimonials.length === 0}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className={`testimonials-grid ${visibleElements.includes(12) ? "visible" : ""}`}>
              {currentTestimonials.length > 0 ? (
                currentTestimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="testimonial-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="testimonial-rating">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`star ${i < testimonial.rating ? "filled" : ""}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                      ))}
                    </div>
                    <p className="testimonial-content">"{testimonial.content}"</p>
                    <div className="testimonial-author">
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="loading-testimonials">Loading testimonials...</div>
              )}
            </div>

            <button
              className="slider-arrow slider-arrow-right"
              onClick={nextSlide}
              aria-label="Next testimonial"
              disabled={testimonials.length === 0}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="testimonial-form-container">
            {!showTestimonialForm ? (
              <button className="add-testimonial-btn" onClick={() => setShowTestimonialForm(true)}>
                Share Your Experience
              </button>
            ) : (
              <form className="testimonial-form" onSubmit={handleTestimonialSubmit}>
                <h3>Share Your Experience</h3>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Your Role/Title"
                  value={newTestimonial.role}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                />
                <textarea
                  placeholder="Tell us about your experience..."
                  value={newTestimonial.content}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                  required
                />
                <div className="rating-input">
                  <label>Rating:</label>
                  <div className="star-rating">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`star clickable ${i < (hoverRating || tempRating) ? "filled" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        onClick={() => handleStarClick(i + 1)}
                        onMouseEnter={() => handleStarHover(i + 1)}
                        onMouseLeave={handleStarLeave}
                      >
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    Submit
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setShowTestimonialForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Final CTA Section */}
        <section ref={ctaRef} className={`final-cta-section ${visibleElements.includes(13) ? "visible" : ""}`}>
          <div className="cta-content">
            <h2 className="cta-title colorful-text">Ready to Transform Your Image Workflow?</h2>
            <p className="cta-description">
              Join thousands of creators who have revolutionized their image management with our AI-powered platform.
              Start organizing, editing, and enhancing your digital assets today.
            </p>
            <div className="cta-buttons">
              <button className="cta-button primary large" onClick={handleGetStarted}>
                <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Get Started
              </button>
            </div>
            <p className="cta-note">No credit card required • Free to start • Secure AWS storage</p>
          </div>
        </section>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setShowAuthModal(false)}>
              ×
            </button>
            <div className="auth-form-container">
              <h2>{isSignIn ? "Sign In" : "Sign Up"}</h2>
              <form className="auth-form">
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                {!isSignIn && <input type="password" placeholder="Confirm Password" required />}
                <button type="submit" className="auth-submit-btn">
                  {isSignIn ? "Sign In" : "Sign Up"}
                </button>
              </form>
              <p className="auth-toggle">
                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsSignIn(!isSignIn)} className="auth-toggle-btn">
                  {isSignIn ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
