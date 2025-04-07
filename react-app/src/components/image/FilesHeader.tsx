import { Add, ArrowUpward, Cancel, CreateNewFolder, FolderOpen } from "@mui/icons-material"
import { Box, Button, IconButton, TextField, Typography } from "@mui/material"

const FilesHeader = () => {
    return(<>
    


    <Box sx={{ mt: 18, ml: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton size="small" disabled={currentFolder === null} onClick={handleUpClick}>
                    <ArrowUpward />
                </IconButton>
                <Box sx={{ ml: 2,display: 'inline-flex', }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {currentUser?.name}
                    </Typography>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                        { path.split('/').filter(segment => segment !== "").map((segment, index) => (
                            <Typography key={index} variant="h6" color="primary" sx={{ fontWeight: 'bold', display: 'inline' }}>
                                / {segment}
                            </Typography>
                        ))}
                    </Box>
                </Box>
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
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
                <Box mt={2} sx={{ transition: 'opacity 0.5s ease-in-out', opacity: showInput ? 1 : 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                    <TextField
                        placeholder="Folder Name"
                        variant="outlined"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        sx={{ marginRight: 1, width: '200px', backgroundColor: '#f0f0f0', borderRadius: 1 }}
                        InputProps={{
                            style: { paddingLeft: '10px' }
                        }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <IconButton
                       
                            color="secondary"
                            onClick={addFolder}
                            sx={{
                                backgroundColor: '#4caf50',
                                ':hover': {
                                    backgroundColor: '#45a049'
                                },
                                color: 'white',
                                marginBottom: 1,
                                width: 25,
                                height: 25
                            }}
                        >
                            <FolderOpen sx={{fontSize:14}}/>
                        </IconButton>
                        <IconButton
                        size="small"
                            color="secondary"
                            onClick={handleCancel}
                            sx={{
                                backgroundColor: '#f44336',
                                ':hover': {
                                    backgroundColor: '#d32f2f'
                                },
                                color: 'white',
                                width: 25,
                                height: 25
                            }}
                        >
                            <Cancel sx={{fontSize:14}}/>
                        </IconButton>
                    </Box>
                </Box>
            )}
        </Box>

        
    </>)
}
export default FilesHeader