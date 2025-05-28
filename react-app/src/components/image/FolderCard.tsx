"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store/store"
import type { FolderType } from "../../types/FolderType"
import { softDeleteFolder, softDeleteFolderRecursively, updateFolder } from "../../store/foldersSlice"
import { useNotificationHelpers } from "../../hooks/useNotification"
import "../../css/FolderCard.css"

const FolderCard = ({
  initFolderName,
  folderId,
  parentId,
  path,
  onOpen,
}: {
  initFolderName: string
  folderId: number
  parentId: number | null
  path: string
  onOpen: any
}) => {
  const [hover, setHover] = useState(false)
  const [folderName, setFolderName] = useState(initFolderName)
  const [isEditing, setIsEditing] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const { success, error, warning } = useNotificationHelpers()

  const handleOpen = () => {
    onOpen(folderId)
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value)
  }

  const handleKeyPress = async (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      setIsEditing(false)
      try {
        const updatedFolder: Partial<FolderType> = {
          id: folderId,
          name: folderName,
          parentId,
        }
        const res = await dispatch(updateFolder({ id: folderId, folder: updatedFolder }))

        if (res.meta.requestStatus === "fulfilled") {
          success("Folder Updated", `Folder renamed to "${folderName}" successfully`)
        } else {
          error("Update Failed", "Failed to update folder name")
          setFolderName(initFolderName)
        }
      } catch (err) {
        console.error("Update error:", err)
        error("Update Failed", "An error occurred while updating the folder")
        setFolderName(initFolderName)
      }
    } else if (event.key === "Escape") {
      cancelEdit()
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setFolderName(initFolderName)
  }

  const handleDelete = async () => {
    try {
      const res = await dispatch(softDeleteFolder(folderId))

      if (res.meta.requestStatus === "fulfilled") {
        success("Folder Deleted", `Folder "${initFolderName}" was deleted successfully`)
      } else if (res.payload?.status === 409) {
        warning("Folder Not Empty", "The folder contains subfolders or files. Do you want to delete anyway?", {
          duration: 0,
          actions: [
            {
              text: "Cancel",
              onClick: () => console.log("Delete cancelled"),
              primary: false,
            },
            {
              text: "Delete All",
              onClick: async () => {
                try {
                  const recursiveRes = await dispatch(softDeleteFolderRecursively(folderId))
                  if (recursiveRes.meta.requestStatus === "fulfilled") {
                    success(
                      "Folder Deleted",
                      `Folder "${initFolderName}" and all its contents were deleted successfully`,
                    )
                  } else {
                    error("Delete Failed", "Failed to delete folder and its contents")
                  }
                } catch (err) {
                  console.error("Recursive delete error:", err)
                  error("Delete Failed", "An error occurred while deleting the folder")
                }
              },
              primary: true,
            },
          ],
        })
      } else {
        error("Delete Failed", res.payload?.response?.data || "Failed to delete folder")
      }
    } catch (err) {
      console.error("Delete error:", err)
      error("Delete Failed", "An error occurred while deleting the folder")
    }
  }

  return (
    <article
      className={`folder-card ${hover ? "hover" : ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="folder-card-glow"></div>
      <div className="folder-card-particles">
        <div className="folder-particle particle-1"></div>
        <div className="folder-particle particle-2"></div>
        <div className="folder-particle particle-3"></div>
      </div>

      <div className="folder-icon-container" onClick={handleOpen}>
        <div className="folder-icon-bg"></div>
        <svg className="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <div className="folder-icon-shine"></div>
      </div>

      <div className="folder-content">
        {isEditing ? (
          <div className="folder-edit-container">
            <input
              type="text"
              value={folderName}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              className="folder-edit-input"
              autoFocus
            />
            <button className="folder-cancel-btn" onClick={cancelEdit}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </button>
          </div>
        ) : (
          <h3 className="folder-name" onDoubleClick={handleDoubleClick}>
            {folderName}
          </h3>
        )}
      </div>

      {hover && (
        <div className="folder-actions">
          <button className="folder-action-btn edit-btn" onClick={handleDoubleClick} title="Edit name">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className="folder-action-btn delete-btn" onClick={handleDelete} title="Delete folder">
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

export default FolderCard
