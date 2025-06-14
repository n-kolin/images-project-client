import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../../store/store"
import ImgCard from "./ImgCard"
import { getChildFiles, getFilesByUser } from "../../store/filesSlice"
import { getFolderById, getChildFolders, getFoldersByUser, addNewFolder } from "../../store/foldersSlice"
import FolderCard from "./FolderCard"
import Loading from "../Loading"
import Header from "./Header"
import "../../css/AllFiles.css"
import { useNotificationHelpers } from "../../hooks/useNotification"

const AllFiles = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { success, error } = useNotificationHelpers()
  const [path, setPath] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [creatingFolder, setCreatingFolder] = useState(false)

  const loadingFolder = useSelector((state: StoreType) => state.folders.loadingList)
  const loadingFile = useSelector((state: StoreType) => state.files.loadingList)

  const allFiles = useSelector((state: StoreType) => state.files.files)
  const allFolders = useSelector((state: StoreType) => state.folders.folders)

  const currentUser = useSelector((state: StoreType) => state.auth.currentUser)
  const currentFolder = useSelector((state: StoreType) => state.folders.selectedFolder)

  const filteredFiles = allFiles.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredFolders = allFolders.filter((folder) => folder.name.toLowerCase().includes(searchQuery.toLowerCase()))

  useEffect(() => {
    const fetchFiles = async () => {
      const filesAction = await dispatch(getFilesByUser(currentUser?.id || -1))
      const foldersAction = await dispatch(getFoldersByUser(currentUser?.id || -1))

      console.log(filesAction)
      console.log(foldersAction)
    }

    fetchFiles().then(() => {
      console.log(allFiles)
      console.log(allFolders)
    })
  }, [])

  const handleFolderClick = async (folderId: number) => {
    const filesAction = await dispatch(getChildFiles(folderId))
    const foldersAction = await dispatch(getChildFolders(folderId))
    console.log(filesAction)
    console.log(foldersAction)
    const res = await dispatch(getFolderById(folderId))

    console.log(currentFolder)
    setPath((prev) => prev + `/${res.payload.name}`)

    console.log(res)
    console.log(allFiles)
    console.log(allFolders)
  }

  const handleCreateFolder = async () => {
    setCreatingFolder(true)
    try {
      const date = new Date().toISOString().split("T")[0]
      const newFolder = {
        name: newFolderName || `NEWFOLDER_${date}`,
        createdBy: currentUser?.id,
        parentId: currentFolder?.id || null,
      }
      const action = await dispatch(addNewFolder(newFolder))
      console.log(action)

      success("Folder Created", `Folder "${newFolderName || `NEWFOLDER_${date}`}" was created successfully`)
      setNewFolderName("")
      setShowCreateFolderModal(false)
    } catch (err) {
      error("Error", "Failed to create folder. Please try again.")
    } finally {
      setCreatingFolder(false)
    }
  }

  return (
    <>
      <Header
        path={path}
        setPath={setPath}
        currentFolder={currentFolder}
        currentUser={currentUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateFolder={() => setShowCreateFolderModal(true)}
      />

      {(loadingFolder || loadingFile) && <Loading />}

      <main className="main-content">
        <div className="content-background">
          <div className="bg-orb orb-1"></div>
          <div className="bg-orb orb-2"></div>
          <div className="bg-orb orb-3"></div>
          <div className="bg-orb orb-4"></div>
        </div>

        {filteredFolders.length > 0 && (
          <section className="folders-section">
            <div className="folders-grid">
              {filteredFolders.map((folder) => (
                <div key={folder.id} className="grid-item">
                  <FolderCard
                    path={path}
                    folderId={folder.id}
                    parentId={folder.parentId}
                    initFolderName={folder.name}
                    onOpen={handleFolderClick}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {filteredFiles.length > 0 && (
          <section className="files-section">
            <div className="files-grid">
              {filteredFiles.map((file) => (
                <div key={file.id} className="grid-item">
                  <ImgCard userId={currentUser?.id || -1} id={file.id} path={file.path} name={file.name} />
                </div>
              ))}
            </div>
          </section>
        )}

        {filteredFolders.length === 0 && filteredFiles.length === 0 && !loadingFolder && !loadingFile && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="empty-title">
              {searchQuery ? `No results found for "${searchQuery}"` : "No files or folders"}
            </h3>
            <p className="empty-description">
              {searchQuery
                ? "Try adjusting your search terms or clear the search to see all files"
                : "Start by adding your first file or creating a new folder"}
            </p>
          </div>
        )}
      </main>
      {showCreateFolderModal && (
        <div
          className="modal-overlay-fixed"
          onClick={(e) => e.target === e.currentTarget && setShowCreateFolderModal(false)}
        >
          <div className="modal-content-centered">
            <div className="modal-header">
              <h2 className="modal-title">Create New Folder</h2>
              <button className="modal-close" onClick={() => setShowCreateFolderModal(false)}>
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
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="modal-input"
                  autoFocus
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn cancel-btn"
                onClick={() => {
                  setShowCreateFolderModal(false)
                  setNewFolderName("")
                }}
              >
                Cancel
              </button>
              <button className="modal-btn submit-btn" onClick={handleCreateFolder} disabled={creatingFolder}>
                {creatingFolder ? (
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
    </>
  )
}

export default AllFiles


