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
  }

  const handleCancel = () => {
    setShowInput(false)
    setFolderName("")
  }

  return (
    <div className="file-header">
      <div className="header-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      <div className="header-main">
        <button
          className={`nav-up-btn ${currentFolder === null ? "disabled" : ""}`}
          disabled={currentFolder === null}
          onClick={handleUpClick}
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M7 14l5-5 5 5" />
          </svg>
        </button>

        <div className="breadcrumb-container">
          <h1 className="breadcrumb-text">{currentUser?.name + path.replace(/\//g, " / ")}</h1>
        </div>

        <div className="action-buttons">
          <button className="action-btn primary" onClick={handleAddFile}>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            Add File
          </button>
          <button className="action-btn secondary" onClick={() => setShowInput(true)}>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <path d="M12 11v6M9 14h6" />
            </svg>
            Add Folder
          </button>
        </div>
      </div>

      {showInput && (
        <div className="folder-input-container">
          <input
            type="text"
            placeholder="Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="folder-input"
          />
          <div className="input-actions">
            <button className="input-btn confirm" onClick={addFolder}>
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <button className="input-btn cancel" onClick={handleCancel}>
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
