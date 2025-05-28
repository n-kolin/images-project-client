"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store/store"
import { Box, Button, IconButton, TextField, Typography } from "@mui/material"
import { Add, ArrowUpward, Cancel, CreateNewFolder, FolderOpen } from "@mui/icons-material"
import { addNewFolder, clearSelectedFolder, getFolderById } from "../../store/foldersSlice"
import { getChildFiles, getFilesByUser } from "../../store/filesSlice"
import { getChildFolders, getFoldersByUser } from "../../store/foldersSlice"
import { useNavigate } from "react-router"
import type { FolderType } from "../../types/FolderType"

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
    <Box sx={{ mt: 18, ml: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton size="small" disabled={currentFolder === null} onClick={handleUpClick}>
          <ArrowUpward />
        </IconButton>
        <Box sx={{ ml: 2, display: "inline-flex" }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
            {currentUser?.name + path.replace(/\//g, " / ")}
          </Typography>
        </Box>
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddFile}
            sx={{ marginRight: 2 }}
          >
            Add File
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CreateNewFolder />}
            onClick={() => setShowInput(true)}
          >
            Add Folder
          </Button>
        </Box>
      </Box>
      {showInput && (
        <Box
          mt={2}
          sx={{
            transition: "opacity 0.5s ease-in-out",
            opacity: showInput ? 1 : 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <TextField
            placeholder="Folder Name"
            variant="outlined"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            sx={{ marginRight: 1, width: "200px", backgroundColor: "#f0f0f0", borderRadius: 1 }}
            InputProps={{
              style: { paddingLeft: "10px" },
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <IconButton
              color="secondary"
              onClick={addFolder}
              sx={{
                backgroundColor: "#4caf50",
                ":hover": {
                  backgroundColor: "#45a049",
                },
                color: "white",
                marginBottom: 1,
                width: 25,
                height: 25,
              }}
            >
              <FolderOpen sx={{ fontSize: 14 }} />
            </IconButton>
            <IconButton
              size="small"
              color="secondary"
              onClick={handleCancel}
              sx={{
                backgroundColor: "#f44336",
                ":hover": {
                  backgroundColor: "#d32f2f",
                },
                color: "white",
                width: 25,
                height: 25,
              }}
            >
              <Cancel sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Header
