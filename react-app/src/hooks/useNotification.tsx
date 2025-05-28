"use client"

import { useState, useRef, useCallback, createContext, useContext, type ReactNode } from "react"
import NotificationToast, { type NotificationProps, type NotificationRef } from "../components/NotificationToast"

interface NotificationContextType {
  showNotification: (props: Omit<NotificationProps, "onClose">) => void
  hideNotification: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationProps | null>(null)
  const notificationRef = useRef<NotificationRef>(null)

  const showNotification = useCallback((props: Omit<NotificationProps, "onClose">) => {
    setNotification({
      ...props,
      onClose: () => setNotification(null),
    })

    setTimeout(() => {
      notificationRef.current?.show()
    }, 10)
  }, [])

  const hideNotification = useCallback(() => {
    notificationRef.current?.hide()
  }, [])

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification && <NotificationToast ref={notificationRef} {...notification} />}
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
