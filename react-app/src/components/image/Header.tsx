import type React from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store/store"
import { clearSelectedFolder, getFolderById } from "../../store/foldersSlice"
import { getChildFiles, getFilesByUser } from "../../store/filesSlice"
import { getChildFolders, getFoldersByUser } from "../../store/foldersSlice"
import { useNavigate } from "react-router"
import "../../css/Header.css"

interface HeaderProps {
  path: string
  setPath: (path: string) => void
  currentFolder: any
  currentUser: any
  searchQuery: string
  setSearchQuery: (query: string) => void
  onCreateFolder: () => void
}

const Header = ({
  path,
  setPath,
  currentFolder,
  currentUser,
  searchQuery,
  setSearchQuery,
  onCreateFolder,
}: HeaderProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleAddFile = () => {
    const params = new URLSearchParams()
    if (path) params.append("path", path)
    if (currentFolder) params.append("folderId", currentFolder.id.toString())
    navigate(`/upload?${params.toString()}`)
  }

  const handleUpClick = async () => {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <>
      <div className="file-header-compact">
        <div className="header-glow"></div>

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

        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={clearSearch} title="Clear search">
                <svg className="clear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
              </button>
            )}
            <div className="search-icon-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
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
          <button className="action-btn-compact secondary" onClick={onCreateFolder}>
            <svg className="btn-icon-compact" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <path d="M12 11v6M9 14h6" />
            </svg>
            New Folder
          </button>
        </div>
      </div>
    </>
  )
}

export default Header

