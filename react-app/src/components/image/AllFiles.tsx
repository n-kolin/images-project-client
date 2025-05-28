// import { useEffect, useState } from "react";

// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, StoreType } from "../../store/store";
// import { Box, Button, Grid2, IconButton, TextField, Typography } from "@mui/material";
// import ImgCard from "./ImgCard";
// import { getChildFiles, getFilesByUser } from "../../store/filesSlice";
// import { addNewFolder, clearSelectedFolder, deleteFolder, getFolderById } from "../../store/foldersSlice";
// import { useNavigate } from "react-router";
// import FolderCard from "./FolderCard";
// import { getChildFolders, getFoldersByUser } from "../../store/foldersSlice";
// import { FolderType } from "../../types/FolderType";
// import { Add, ArrowBack, ArrowBackIosNewRounded, ArrowUpward, Cancel, CreateNewFolder, FolderOpen } from "@mui/icons-material";
// import Loading from "../Loading";

// const AllFiles = () => {


//     //loading
//     const loadingFolder = useSelector((state: StoreType) => state.folders.loadingList);
//     const loadingFile = useSelector((state: StoreType) => state.files.loadingList);


//     //add folder
//     const [showInput, setShowInput] = useState(false);
//     const [folderName, setFolderName] = useState('');


//     // const [rootFolder, setRootFolder] = useState<number | undefined>(undefined);
//     const dispatch = useDispatch<AppDispatch>();

//     const allFiles = useSelector((state: StoreType) => state.files.files);
//     const allFolders = useSelector((state: StoreType) => state.folders.folders);

//     const currentUser = useSelector((state: StoreType) => state.auth.currentUser);
//     const currentFolder = useSelector((state: StoreType) => state.folders.selectedFolder);

//     // const [files, setFiles] = useState<FileType[]>([]);
//     const [path, setPath] = useState<string>(''); // הוספת משתנה מצב עבור path
//     const navigate = useNavigate();

//     const handleAddFile = () => {

//         console.log(currentFolder)
//         console.log(path);
//         ;

//         const params = new URLSearchParams();
//         if (path) params.append('path', path);
//         if (currentFolder) params.append('folderId', currentFolder.id.toString());
//         navigate(`/upload?${params.toString()}`);
//     };


//     useEffect(() => {

//         const fetchFiles = async () => {
//             const filesAction = await dispatch(getFilesByUser(currentUser?.id || -1));
//             const foldersAction = await dispatch(getFoldersByUser(currentUser?.id || -1));

//             console.log(filesAction);
//             console.log(foldersAction);
//         };

//         fetchFiles().then(() => {
//             console.log(allFiles);
//             console.log(allFolders);
//         });
//     }, []);


//     const handleFolderClick = async (folderId: number) => {

//         const filesAction = await dispatch(getChildFiles(folderId));
//         const foldersAction = await dispatch(getChildFolders(folderId));
//         console.log(filesAction);
//         console.log(foldersAction);
//         const res = await dispatch(getFolderById(folderId));

//         console.log(currentFolder);
//         setPath((prev) => prev + `/${res.payload.name}`);


//         // setRootFolder(folderId);
//         console.log(res);


//         // currentFolder = res.payload
//         console.log(allFiles);
//         console.log(allFolders);

//     };
//     const handleUpClick = async () => {
//         // debugger

//         const folderId = currentFolder?.parentId;
//         if (!folderId) {

//             const filesAction = await dispatch(getFilesByUser(currentUser?.id || -1));
//             const foldersAction = await dispatch(getFoldersByUser(currentUser?.id || -1));
//             console.log(filesAction);
//             console.log(foldersAction);
//             dispatch(clearSelectedFolder());
//         }
//         else {

//             const filesAction = await dispatch(getChildFiles(folderId));
//             const foldersAction = await dispatch(getChildFolders(folderId));
//             console.log(filesAction);
//             console.log(foldersAction);
//             const res = await dispatch(getFolderById(folderId));
//             console.log(currentFolder);
//             console.log(res);
//         }



//         setPath((prev) => prev.substring(0, prev.lastIndexOf('/')));



//         console.log(allFiles);
//         console.log(allFolders);
//     };



//     const addFolder = async () => {

//         const date = new Date().toISOString().split('T')[0];
//         const newFolder: Partial<FolderType> = {
//             name: folderName || `NEWFOLDER_${date}`,
//             createdBy: currentUser?.id,
//             parentId: currentFolder?.id || null,
//         }
//         const action = await dispatch(addNewFolder(newFolder));
//         console.log(action);

//         setFolderName('')
//         setShowInput(false);
//     }


//     const handleCancel = () => {
//         setShowInput(false);
//         setFolderName('');
//     };
//     return (<>

//         <Box sx={{ mt: 18, ml: 3 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <IconButton size="small" disabled={currentFolder === null} onClick={handleUpClick}>
//                     <ArrowUpward />
//                 </IconButton>
//                 <Box sx={{ ml: 2, display: 'inline-flex', }}>
//                     <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
//                         {currentUser?.name + path.replace(/\//g, " / ")}
//                     </Typography>

//                 </Box>
//                 <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<Add />}
//                         onClick={handleAddFile}
//                         sx={{ marginRight: 2 }}
//                     >
//                         Add File
//                     </Button>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<CreateNewFolder />}
//                         onClick={() => setShowInput(true)}
//                     >
//                         Add Folder
//                     </Button>
//                 </Box>
//             </Box>
//             {showInput && (
//                 <Box mt={2} sx={{ transition: 'opacity 0.5s ease-in-out', opacity: showInput ? 1 : 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
//                     <TextField
//                         placeholder="Folder Name"
//                         variant="outlined"
//                         value={folderName}
//                         onChange={(e) => setFolderName(e.target.value)}
//                         sx={{ marginRight: 1, width: '200px', backgroundColor: '#f0f0f0', borderRadius: 1 }}
//                         InputProps={{
//                             style: { paddingLeft: '10px' }
//                         }}
//                     />
//                     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                         <IconButton

//                             color="secondary"
//                             onClick={addFolder}
//                             sx={{
//                                 backgroundColor: '#4caf50',
//                                 ':hover': {
//                                     backgroundColor: '#45a049'
//                                 },
//                                 color: 'white',
//                                 marginBottom: 1,
//                                 width: 25,
//                                 height: 25
//                             }}
//                         >
//                             <FolderOpen sx={{ fontSize: 14 }} />
//                         </IconButton>
//                         <IconButton
//                             size="small"
//                             color="secondary"
//                             onClick={handleCancel}
//                             sx={{
//                                 backgroundColor: '#f44336',
//                                 ':hover': {
//                                     backgroundColor: '#d32f2f'
//                                 },
//                                 color: 'white',
//                                 width: 25,
//                                 height: 25
//                             }}
//                         >
//                             <Cancel sx={{ fontSize: 14 }} />
//                         </IconButton>
//                     </Box>
//                 </Box>
//             )}
//         </Box>




//         {
//             (loadingFolder || loadingFile)
//             &&
//             ( <Loading /> )
//         }

//         <Box sx={{ ml: 25, mr: 25, mb: 10, mt: 10, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
//             {allFolders.map((folder) => (
//                 <Box
//                     key={folder.id}
//                     sx={{
//                         flex: '1 1 calc(24% - 16px)', // 4 פריטים בשורה עם רווחים
//                         maxWidth: 'calc(25% - 16px)',
//                         boxSizing: 'border-box',
//                     }}
//                 >
//                     <FolderCard path={path} folderId={folder.id} parentId={folder.parentId} initFolderName={folder.name} onOpen={handleFolderClick} />
//                 </Box>
//             ))}
//         </Box>
//         <Box sx={{ ml: 25, mr: 25, mb: 10, display: 'flex', flexWrap: 'wrap', gap: 4 }}>


//             {allFiles.map((file) => (
//                 <Box
//                     key={file.id}
//                     sx={{
//                         flex: '1 1 calc(24% - 16px)', // 4 פריטים בשורה עם רווחים
//                         maxWidth: 'calc(25% - 16px)',
//                         boxSizing: 'border-box',
//                     }}
//                 >
//                     <ImgCard userId={currentUser?.id || -1} id={file.id} path={file.path} name={file.name} />
//                 </Box>
//             ))}
//         </Box>




//     </>)
// }
// export default AllFiles
"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../../store/store"
import ImgCard from "./ImgCard"
import { getChildFiles, getFilesByUser } from "../../store/filesSlice"
import { getFolderById } from "../../store/foldersSlice"
import FolderCard from "./FolderCard"
import { getChildFolders, getFoldersByUser } from "../../store/foldersSlice"
import Loading from "../Loading"
import "../../css/AllFiles.css"
import Header from "./Header"

const AllFiles = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [path, setPath] = useState<string>("") // הוספת משתנה מצב עבור path

  //loading
  const loadingFolder = useSelector((state: StoreType) => state.folders.loadingList)
  const loadingFile = useSelector((state: StoreType) => state.files.loadingList)

  const allFiles = useSelector((state: StoreType) => state.files.files)
  const allFolders = useSelector((state: StoreType) => state.folders.folders)

  const currentUser = useSelector((state: StoreType) => state.auth.currentUser)
  const currentFolder = useSelector((state: StoreType) => state.folders.selectedFolder)

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

  return (
    <div className="files-container">
      <Header path={path} setPath={setPath} currentFolder={currentFolder} currentUser={currentUser} />

      {(loadingFolder || loadingFile) && <Loading />}

      <div className="content-wrapper">
        <div className="content-background">
          <div className="bg-orb orb-1"></div>
          <div className="bg-orb orb-2"></div>
          <div className="bg-orb orb-3"></div>
          <div className="bg-orb orb-4"></div>
        </div>

        <div className="folders-grid">
          {allFolders.map((folder) => (
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

        <div className="files-grid">
          {allFiles.map((file) => (
            <div key={file.id} className="grid-item">
              <ImgCard userId={currentUser?.id || -1} id={file.id} path={file.path} name={file.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllFiles


