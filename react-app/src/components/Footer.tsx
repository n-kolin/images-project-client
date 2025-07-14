"use client"

import { Github } from "lucide-react" 
import "../css/Footer.css" 

export default function Footer() {

  const githubUrl = "https://github.com/n-kolin/images-project-client"

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-main-content">
          <div className="footer-column footer-brand-column">
            <h3 className="footer-logo">ImageEditor</h3>
            <p className="footer-tagline">
              Empowering creators with AI-driven image editing and seamless asset management.
            </p>
          </div>

          <div className="footer-column footer-social-column">
            <h4 className="footer-heading">Connect With Us</h4>
            <ul className="footer-social-list">
              <li>
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                  <Github className="social-icon" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; 2025 <span className="footer-company-name">Nomi Kolin</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
