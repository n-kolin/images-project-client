import type React from "react"
import { useState, type ChangeEvent } from "react"
import axios from "axios"
import type { FileType } from "../../types/FileType"
import { addFile } from "../../store/filesSlice"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../../store/store"
import apiClient from "../../apiClient"
import { useLocation, useNavigate } from "react-router"
import "../../css/UploadImage.css"
import { useNotificationHelpers } from "../../hooks/useNotification"

const UploadImage = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const path = searchParams.get("path") || ""
  const folderId = searchParams.get("folderId") || ""

  const [file, setFile] = useState<File | null>(null)
  const [_, setMessage] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { success, error } = useNotificationHelpers()

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  const currentUser = useSelector((state: StoreType) => state.auth.currentUser)

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload")
      return
    }

    setIsUploading(true)

    try {
      const response = await apiClient.get("file/presigned-url", {
        params: {
          userId: currentUser?.id,
          path: path || null,
          fileName: file.name,
          contentType: file.type,
        },
      })

      const url = response.data.url

      const uploadResponse = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      })

      if (uploadResponse.status === 200) {
        setMessage("File uploaded successfully")
      } else {
        setMessage("Failed to upload file")
      }

      const newFile: Partial<FileType> = {
        name: file.name,
        type: file.type,
        size: file.size,
        path: path || "/",
        fullPath: url,
        createdBy: currentUser?.id,
        folderId: folderId ? Number(folderId) : null,
      }

      const res = await dispatch(addFile(newFile))
      console.log("add file to DB", res)

      success("Upload Successful", `File "${file.name}" was uploaded successfully`)
      navigate("/")
    } catch (err) {
      console.error("Error uploading file:", err)
      setMessage("Error uploading file")
      error("Upload Failed", "There was an error uploading your file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="upload-container">
      <div className="upload-background">
        <div className="upload-orb orb-1"></div>
        <div className="upload-orb orb-2"></div>
        <div className="upload-orb orb-3"></div>
      </div>

      <div className="upload-content">
        <div className="upload-header">
          <h1 className="upload-title">Upload Your File</h1>
          <p className="upload-subtitle">Drag and drop your file or click to browse</p>
        </div>

        <div
          className={`drop-zone ${isDragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <div className="drop-zone-content">
            {!file ? (
              <>
                <div className="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17,8 12,3 7,8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <h3 className="drop-zone-title">Drop your file here</h3>
                <p className="drop-zone-text">or click the button below to browse</p>

                <div className="browse-section">
                  <input type="file" onChange={handleFileChange} className="file-input" id="file-upload" />
                  <label htmlFor="file-upload" className="browse-btn">
                    <svg className="browse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17,8 12,3 7,8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Browse Files
                  </label>
                </div>
              </>
            ) : (
              <div className="file-preview">
                <div className="file-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                </div>
                <div className="file-info">
                  <h4 className="file-name">{file.name}</h4>
                  <p className="file-size">{formatFileSize(file.size)}</p>
                </div>
                <button
                  className="remove-file-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {file && (
          <div className="upload-actions">
            <button className="upload-btn" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <div className="upload-spinner"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="upload-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Upload File
                </>
              )}
            </button>
          </div>
        )}

        <div className="upload-info">
          <div className="info-item">
            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>Fast and secure upload</span>
          </div>
          <div className="info-item">
            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <circle cx="12" cy="16" r="1" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Your files are protected</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadImage
