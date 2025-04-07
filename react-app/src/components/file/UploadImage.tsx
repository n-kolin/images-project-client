import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { FileType } from '../../types/FileType';
import { addFile } from '../../store/filesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../../store/store';
import { Box, Button, Typography } from '@mui/material';
import apiClient from '../../apiClient';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router';

const UploadImage: React.FC = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const path = searchParams.get('path') || '';
    const folderId = searchParams.get('folderId') || '';

    
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');

    const dispatch = useDispatch<AppDispatch>();


    const navigate = useNavigate();

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files[0]; // קובץ שנגרר
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };


    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const currentUser = useSelector((state: StoreType) => state.auth.currentUser);

    const handleUpload = async () => {
        
        if (!file) {
            setMessage('Please select a file to upload');
            return;
        }
        console.log('fffffff');

        try {
            // get pre-signed url
            const response = await apiClient.get('file/presigned-url', {
                params: {
                    userId: currentUser?.id,
                    path: path || null,
                    fileName: file.name,
                    contentType: file.type,
                }
                //   userName: 'your-username' // Replace with the actual username


            }
            );
            console.log(response);

            const url = response.data.url;

            console.log(url);

            // Upload the file to S3 using the pre-signed URL
            const uploadResponse = await axios.put(url, file, {
                headers: {
                    'Content-Type': file.type
                }
            });

            if (uploadResponse.status === 200) {
                setMessage('File uploaded successfully');
            } else {
                setMessage('Failed to upload file');
            }

            


            //add file to DB
            const newFile: Partial<FileType> = {
                name: file.name,
                type: file.type,
                size: file.size,
                path:path||'/', // add the path to the file
                fullPath: url,
                createdBy:currentUser?.id,
                folderId:folderId? Number(folderId) : null,
            }
            console.log(file);
            console.log(newFile);

            const res = await dispatch(addFile(newFile))
            console.log('add file to DB', res);

            Swal.fire({
                icon: "success",
                title: "Yay!",
                text: 'File uploaded successfully',
            });
            navigate('/');


        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Error uploading file');
        }
    };

    return (<>
        {/* <div>
            <h2>Upload Image to AWS S3</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
        </div> */}


        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', h: '80vh', mt: '40px', pt:20 }}>
            <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                sx={{
                    border: '2px dashed #ccc',
                    padding: '40px',
                    width: '400px',
                    // height: '250px',
                    textAlign: 'center',
                    marginBottom: '10px',
                    '&:hover': {
                        borderColor: '#007bff'
                    }
                }}
            >
                <Typography >

                    drag the file here
                </Typography>
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // הסתרת הקלט
                    id="file-upload"
                />
                <label htmlFor="file-upload">
                    <Button variant="contained" component="span" sx={{mt:4}}>
                        select file

                    </Button>
                </label>
            </Box>

            <Button onClick={handleUpload} sx={{ mt: 2 }}>upload</Button>
            {/* <Typography>{message}</Typography> */}
            {file && (
        <Typography sx={{ mt: 2 }}>
          Selected file: {file.name}
        </Typography>
      )}

        </Box>
    </>
    );
};

export default UploadImage;