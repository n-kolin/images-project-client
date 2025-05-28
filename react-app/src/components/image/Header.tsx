"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store/store"
import { addNewFolder, clearSelectedFolder, getFolderById } from "../../store/foldersSlice"
import { getChildFiles, getFilesByUser } from "../../store/filesSlice"
import { getChildFolders, getFoldersByUser } from "../../store/foldersSlice"
import { useNavigate } from "react-router"
import type { FolderType } from "../../types/FolderType"
import "../../css/Header.css"

interface HeaderProps {
  path: string
  setPath: (path: string) => void
  currentFolder: any
  currentUser: any
}

const Header = ({ path, setPath, currentFolder, currentUser }: HeaderProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  //add folder
  const [showInput, setShowInput] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddFile = () => {
    console.log(currentFolder)
    console.log(path)

    const params = new URLSearchParams()
    if (path) params.append("path", path)
    if (currentFolder) params.append("folderId", currentFolder.id.toString())
    navigate(`/upload?${params.toString()}`)
  }

  const handleUpClick = async () => {
    // debugger
    const folderId = currentFolder?.parentId
    if (!folderId) {
      const filesAction = await dispatch(getFilesByUser(currentUser?.id || -1))
      const foldersAction = await dispatch(getFoldersByUser(currentUser?.id || -1))
      console.log(filesAction)
      console.log(foldersAction)
      dispatch(clearSelectedFolder())
    } else {
      const filesAction = await dispatch(getChildFiles(folderId))
      const foldersAction = await dispatch(getChildFolders(folderId))
      console.log(filesAction)
      console.log(foldersAction)
      const res = await dispatch(getFolderById(folderId))
      console.log(currentFolder)
      console.log(res)
    }

    setPath((prev) => prev.substring(0, prev.lastIndexOf("/")))
  }

  const addFolder = async () => {
    setLoading(true)
    try {
      const date = new Date().toISOString().split("T")[0]
      const newFolder: Partial<FolderType> = {
        name: folderName || `NEWFOLDER_${date}`,
        createdBy: currentUser?.id,
        parentId: currentFolder?.id || null,
      }
      const action = await dispatch(addNewFolder(newFolder))
      console.log(action)

      setFolderName("")
      setShowInput(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowInput(false)
    setFolderName("")
  }

  return (
    <div className="file-header-compact">
      <div className="breadcrumb-section">
        <button
          className={`nav-up-btn-compact ${currentFolder === null ? "disabled" : ""}`}
          disabled={currentFolder === null}
          onClick={handleUpClick}
          title="Go up one level"
        >
          <svg className="nav-icon-compact" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M7 14l5-5 5 5" />
          </svg>
        </button>

        <div className="breadcrumb-path">
          <span className="path-label">Current Location:</span>
          <span className="path-text">{currentUser?.name + path.replace(/\//g, " / ")}</span>
        </div>
      </div>

      <div className="action-section">
        <button className="action-btn-compact primary" onClick={handleAddFile}>
          <svg className="btn-icon-compact" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          Add File
        </button>
        <button className="action-btn-compact secondary" onClick={() => setShowInput(true)}>
          <svg className="btn-icon-compact" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <path d="M12 11v6M9 14h6" />
          </svg>
          New Folder
        </button>
      </div>

      {showInput && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create New Folder</h2>
              <button className="modal-close" onClick={handleCancel}>
                <svg className="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="input-group">
                <label className="input-label">Folder Name</label>
                <input
                  type="text"
                  placeholder="Enter folder name..."
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="modal-input"
                  autoFocus
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="modal-btn submit-btn" onClick={addFolder} disabled={loading}>
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <svg className="btn-icon-compact" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    Create Folder
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
