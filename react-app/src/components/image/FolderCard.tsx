
import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box, IconButton, TextField, InputAdornment } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import OpenFolder from './OpenFolder';
import { useNavigate } from 'react-router';
import { Cancel, Delete, Edit, FolderOpen, OpenInNew } from '@mui/icons-material';
import { FolderType } from '../../types/FolderType';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { softDeleteFolder, softDeleteFolderRecursively, updateFolder } from '../../store/foldersSlice';
import Swal from 'sweetalert2';

const FolderCard = ({
    initFolderName,
    folderId,
    parentId,
    path,
    onOpen
}:
    {
        initFolderName: string,
        folderId: number,
        parentId: number | null,
        path: string
        onOpen: any
    }) => {

    const navigate = useNavigate();

    const [hover, setHover] = useState(false);

    const handleOpen = () => {
        // path = path ? path + '/' + folderName : folderName;
        // const params = new URLSearchParams();
        // if (path) params.append('path', path);
        // navigate(`/all-files?${params.toString()}`);
        onOpen(folderId);
    };

    const [folderName, setFolderName] = useState(initFolderName);
    const [isEditing, setIsEditing] = useState(false);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFolderName(event.target.value);
    };

    const dispatch = useDispatch<AppDispatch>();
    const handleKeyPress = async (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            setIsEditing(false);
            const updatedFolder: Partial<FolderType> = {
                id: folderId,
                name: folderName,
                parentId
            }
            await dispatch(updateFolder({ id: folderId, folder: updatedFolder }));
            //לשנות את שם התיקיה
            // try {
            //   await axios.put(`/api/folders/${folderId}`, { name: folderName });
            //   console.log('Folder name updated successfully');
            // } catch (error) {
            //   console.error('Error updating folder name:', error);
            // }
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setFolderName(initFolderName);
    };


    const handleDelete = async () => {

        const res = await dispatch(softDeleteFolder(folderId));
        console.log('delete folder', res);
        if (res.meta.requestStatus === 'fulfilled') {
            // מחיקה הצליחה
            console.log('Folder deleted successfully');
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "The folder was successfully deleted.",
            });
        }

        else if (res.payload.status === 409) {
            // שגיאה 409 - Conflict
            const confirm = await Swal.fire({
                icon: "warning",
                title: "Conflict",
                text: "The folder contains subfolders or files.Do you want to delete anyway?",
                showCancelButton: true,
                confirmButtonText: "yes",
                cancelButtonText: "no",
            });

            if (confirm.isConfirmed) {
                const res = await dispatch(softDeleteFolderRecursively(folderId));
                console.log('rec delete', res);

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "The folder was successfully deleted.",
                });
            }
        } else {
            // שגיאה אחרת
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: res.payload.response.data || 'Deletion failed.',
            });
        }




    };
    return (
        <Card
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            sx={{
                maxWidth: 300,
                borderRadius: 2,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                padding: '10px',
                backgroundColor: hover ? 'rgba(0, 0, 0, 0.04)' : 'white',
                transition: 'background-color 0.3s',
                boxShadow: hover ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
                border: '1px solid #ddd', // מסגרת דקה
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // background: 'rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                }}
            >
                <FolderIcon sx={{
                    fontSize: 70,
                    color: 'primary.main',
                    cursor: 'pointer',
                }} onClick={handleOpen} />
            </Box>
            <CardContent>
                {isEditing ? (
                    // <TextField
                    //     value={folderName}
                    //     onChange={handleChange}
                    //     onKeyPress={handleKeyPress}
                    //     autoFocus
                    //     fullWidth
                    //     variant="outlined"
                    //     sx={{
                    //         background: '#fff',
                    //         borderRadius: '4px',
                    //         padding:.2,
                    //         input: { color: '#000' },
                    //     }}

                    //     InputProps={{
                    //         endAdornment: (
                    //             <InputAdornment position="end">
                    //                 <IconButton onClick={cancelEdit}>
                    //                     <Cancel />
                    //                 </IconButton>
                    //             </InputAdornment>
                    //         ),
                    //     }}

                    // />
                    <Box position="relative" width="100%">
                        <TextField
                            value={folderName}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            autoFocus
                            fullWidth
                            variant="standard"
                            multiline

                            sx={{
                                padding: 0,
                                input: {
                                    padding: 0,
                                    color: '#000',
                                    fontSize: 'inherit',
                                    lineHeight: 'inherit',
                                    border: 'none',
                                    outline: 'none',
                                },
                                '.MuiInput-underline:before': {
                                    borderBottom: 'none',
                                },
                                '.MuiInput-underline:after': {
                                    borderBottom: 'none',
                                },
                                '.MuiInput-underline:hover:before': {
                                    borderBottom: 'none',
                                },
                                background: 'transparent',
                                borderRadius: 0,
                            }}
                        />
                        <IconButton
                            onClick={cancelEdit}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                padding: 0,
                                color: '#000'
                            }}
                        >
                            <Cancel fontSize="small" />
                        </IconButton>
                    </Box>
                ) : (
                    <Typography variant="body1" component="div" noWrap sx={{ textAlign: 'center', marginTop: '10px' }}

                        onDoubleClick={handleDoubleClick}
                    >
                        {folderName}
                    </Typography>)}
            </CardContent>
            {
                hover &&
                <CardActions sx={{ position: 'absolute', right: 10, display: 'flex', flexDirection: 'column' }}>
                    {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={onOpen}
                    sx={{
                        backgroundColor: '#6a11cb',
                        backgroundImage: 'linear-gradient(315deg, #6a11cb 0%, #2575fc 74%)',
                        color: '#fff',
                        '&:hover': {
                            backgroundImage: 'linear-gradient(315deg, #2575fc 0%, #6a11cb 74%)',
                        },
                    }}
                >
                    Open
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={onDelete}
                    sx={{
                        backgroundColor: '#ff416c',
                        backgroundImage: 'linear-gradient(315deg, #ff416c 0%, #ff4b2b 74%)',
                        color: '#fff',
                        '&:hover': {
                            backgroundImage: 'linear-gradient(315deg, #ff4b2b 0%, #ff416c 74%)',
                        },
                    }}
                >
                    Delete
                </Button> */}

                    <IconButton size="small" onClick={handleDoubleClick}>
                        <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={handleDelete}>
                        <Delete />
                    </IconButton>

                    {/* <IconButton size="small" onClick={handleOpen}>
                        <FolderOpen />
                    </IconButton> */}

                </CardActions>
            }
        </Card>
    );
};

export default FolderCard;