"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../../store/store"
import { softDeleteFile } from "../../store/filesSlice"
import { useNotificationHelpers } from "../../hooks/useNotification"
import apiClient from "../../apiClient"
import axios from "axios"
import "../../css/ImgCard.css"

const ImgCard = ({ userId, path, name, id }: { userId: number; path: string; name: string; id: number }) => {
  const [hover, setHover] = useState(false)
  const [url, setUrl] = useState("")
  const [progress, setProgress] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { success, error } = useNotificationHelpers()
  const currentUser = useSelector((state: StoreType) => state.auth.currentUser)

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await apiClient.get("file/download-url", {
          params: {
            userId,
            path: path + (path !== "/" ? "/" : "") + name,
          },
        })
        setUrl(response.data.url)
      } catch (err) {
        console.error("Error loading image:", err)
        setImageError(true)
        error("Error", "Failed to load image")
      }
    }

    loadImage()
  }, [userId, path, name, error])

  const handleImageClick = () => {
    const searchParams = new URLSearchParams(location.search)
    const imageUrl = path + (path !== "/" ? "/" : "") + name
    searchParams.set("url", imageUrl)
    navigate(`/edit?${searchParams.toString()}`)
  }

  const handleDownload = async () => {
    try {
      setProgress(0)

      const response = await apiClient.get("file/download-url", {
        params: {
          userId: currentUser?.id,
          path: path + (path !== "/" ? "/" : "") + name,
        },
      })

      const downloadUrl = response.data.url

      const downloadResponse = await axios.get(downloadUrl, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          setProgress(percent)
        },
      })

      const fileName = name
      const blobUrl = window.URL.createObjectURL(new Blob([downloadResponse.data]))
      const link = document.createElement("a")
      link.href = blobUrl
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)

      setProgress(0)
      success("Download Complete", `File "${fileName}" downloaded successfully`)
    } catch (err) {
      console.error("Download error:", err)
      error("Download Failed", "Failed to download file. Please try again.")
      setProgress(0)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await dispatch(softDeleteFile(id))

      if (res.meta.requestStatus === "fulfilled") {
        success("File Deleted", `File "${name}" was deleted successfully`)
      } else {
        error("Delete Failed", "Failed to delete file. Please try again.")
      }
    } catch (err) {
      console.error("Delete error:", err)
      error("Delete Failed", "An error occurred while deleting the file.")
    }
  }

  return (
    <article
      className={`img-card ${hover ? "hover" : ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="img-card-glow"></div>
      <div className="img-card-particles">
        <div className="img-particle particle-1"></div>
        <div className="img-particle particle-2"></div>
        <div className="img-particle particle-3"></div>
      </div>

      <div className="img-container" onClick={handleImageClick}>
        <div className="img-frame">
          {!imageError && url ? (
            <img
              src={url || "/placeholder.svg"}
              alt={name}
              className={`img-content ${imageLoaded ? "loaded" : ""}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="img-placeholder">
              <svg className="img-placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
              </svg>
              <span className="img-placeholder-text">Image not found</span>
            </div>
          )}
          <div className="img-overlay">
            <div className="img-overlay-content">
              <svg className="img-zoom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
                <path d="M11 6v10M6 11h10" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="img-info">
        <h3 className="img-name" title={name}>
          {name}
        </h3>
        {progress > 0 && (
          <div className="img-progress">
            <span className="progress-text">Downloading: {progress}%</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </div>

      {hover && (
        <div className="img-actions">
          <button
            className="img-action-btn download-btn"
            onClick={handleDownload}
            disabled={progress > 0}
            title="Download file"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button className="img-action-btn delete-btn" onClick={handleDelete} title="Delete file">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      )}
    </article>
  )
}

export default ImgCard
