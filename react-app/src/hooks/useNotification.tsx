"use client"

import { useState, useRef, useCallback, createContext, useContext, type ReactNode } from "react"
import NotificationToast, { type NotificationProps, type NotificationRef } from "../components/NotificationToast"

interface NotificationContextType {
  showNotification: (props: Omit<NotificationProps, "onClose">) => void
  hideNotification: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<(NotificationProps & { id: string })[]>([])
  const notificationRefs = useRef<Map<string, NotificationRef>>(new Map())

  const showNotification = useCallback((props: Omit<NotificationProps, "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const notification = {
      ...props,
      id,
      onClose: () => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
        notificationRefs.current.delete(id)
      },
    }

    setNotifications((prev) => [...prev, notification])

    // Show notification after a small delay to ensure ref is set
    setTimeout(() => {
      const ref = notificationRefs.current.get(id)
      if (ref) {
        ref.show()
      }
    }, 50)
  }, [])

  const hideNotification = useCallback(() => {
    notifications.forEach((notification) => {
      const ref = notificationRefs.current.get(notification.id)
      if (ref) {
        ref.hide()
      }
    })
  }, [notifications])

  const setNotificationRef = useCallback((id: string, ref: NotificationRef | null) => {
    if (ref) {
      notificationRefs.current.set(id, ref)
    } else {
      notificationRefs.current.delete(id)
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          ref={(ref) => setNotificationRef(notification.id, ref)}
          {...notification}
        />
      ))}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

export const useNotificationHelpers = () => {
  const { showNotification } = useNotification()

  const success = useCallback(
    (title: string, message: string, options?: Partial<Omit<NotificationProps, "type" | "title" | "message">>) => {
      showNotification({
        type: "success",
        title,
        message,
        ...options,
      })
    },
    [showNotification],
  )

  const warning = useCallback(
    (title: string, message: string, options?: Partial<Omit<NotificationProps, "type" | "title" | "message">>) => {
      showNotification({
        type: "warning",
        title,
        message,
        ...options,
      })
    },
    [showNotification],
  )

  const error = useCallback(
    (title: string, message: string, options?: Partial<Omit<NotificationProps, "type" | "title" | "message">>) => {
      showNotification({
        type: "error",
        title,
        message,
        ...options,
      })
    },
    [showNotification],
  )

  const info = useCallback(
    (title: string, message: string, options?: Partial<Omit<NotificationProps, "type" | "title" | "message">>) => {
      showNotification({
        type: "info",
        title,
        message,
        ...options,
      })
    },
    [showNotification],
  )

  return {
    success,
    warning,
    error,
    info,
  }
}
