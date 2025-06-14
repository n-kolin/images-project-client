import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import "../css/NotificationToast.css"

export type NotificationType = "success" | "warning" | "error" | "info"

export interface NotificationProps {
  type?: NotificationType
  title: string
  message: string
  duration?: number
  actions?: {
    text: string
    onClick: () => void
    primary?: boolean
  }[]
  onClose?: () => void
}

export interface NotificationRef {
  show: () => void
  hide: () => void
}

const NotificationToast = forwardRef<NotificationRef, NotificationProps>(
  ({ type = "info", title, message, duration = 5000, actions = [], onClose }, ref) => {
    const [visible, setVisible] = useState(false)
    const [exiting, setExiting] = useState(false)
    const timerRef = useRef<number | null>(null)
    const mountedRef = useRef(true)

    const getIcon = () => {
      switch (type) {
        case "success":
          return (
            <svg className="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )
        case "warning":
          return (
            <svg className="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )
        case "error":
          return (
            <svg className="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )
        default:
          return (
            <svg className="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          )
      }
    }

    const show = () => {
      if (!mountedRef.current) return
      setVisible(true)
      if (duration > 0) {
        timerRef.current = window.setTimeout(() => {
          if (mountedRef.current) {
            hide()
          }
        }, duration)
      }
    }

    const hide = () => {
      if (!mountedRef.current) return

      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }

      setExiting(true)
      setTimeout(() => {
        if (mountedRef.current) {
          setVisible(false)
          setExiting(false)
          if (onClose) onClose()
        }
      }, 400)
    }

    useImperativeHandle(ref, () => ({
      show,
      hide,
    }))

    useEffect(() => {
      mountedRef.current = true
      return () => {
        mountedRef.current = false
        if (timerRef.current) {
          window.clearTimeout(timerRef.current)
        }
      }
    }, [])

    if (!visible) return null

    return (
      <div className={`notification-toast ${type} ${exiting ? "exiting" : ""}`}>
        <div className="notification-glow"></div>
        <div className="notification-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
        </div>

        <div className="notification-content">
          <div className="notification-icon-container">{getIcon()}</div>
          <div className="notification-text">
            <h3 className="notification-title">{title}</h3>
            <p className="notification-message">{message}</p>
          </div>
          <button className="notification-close" onClick={hide}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {actions.length > 0 && (
          <div className="notification-actions">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`notification-action-btn ${action.primary ? "primary" : "secondary"}`}
                onClick={() => {
                  action.onClick()
                  hide()
                }}
              >
                {action.text}
              </button>
            ))}
          </div>
        )}

        {duration > 0 && (
          <div className="notification-progress">
            <div className="notification-progress-bar" style={{ animationDuration: `${duration}ms` }}></div>
          </div>
        )}
      </div>
    )
  },
)

NotificationToast.displayName = "NotificationToast"

export default NotificationToast
