import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardActions, IconButton, Typography, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Download from '../file/Download';
import DeleteFile from '../file/DeleteFile';
import apiClient from '../../apiClient';
import axios from 'axios';
import { useNavigate } from 'react-router';


const ImgCard = ({ userId, path, name, id }: { userId: number, path: string, name: string, id: number }) => {
  const [hover, setHover] = useState(false);
  const [url, setUrl] = useState('');


  useEffect(() => {

    const download = async () => {
      
      
      
      const response = await apiClient.get('file/download-url', {
        params: {
          userId,
          path: path + (path!=='/'?  '/':'' )+ name,
        },
      })
      console.log(userId, path + (path!=='/'?  '/':'' )+ name);
      
      setUrl(response.data.url);
      console.log(url);


    };

    download();
  }, []);


  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const handleImageClick = () => {

    const imageUrl = path + (path !== '/' ? '/' : '') + name;
      searchParams.set("url", imageUrl); 
      navigate(`/edit?${searchParams.toString()}`);

  
  };

  return (
    <>

      <Card
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        variant="outlined"
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
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <img
            src={url}
            alt="img"
            onClick={handleImageClick}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <Typography variant="body1" component="div" noWrap sx={{ textAlign: 'center', marginTop: '10px' }}>
            {name}
          </Typography>
        </Box>
        {hover && (
          <CardActions sx={{ position: 'absolute', right: 10, display: 'flex', flexDirection: 'column' }}>
            <Download path={path + (path!=='/'?  '/':'' )+ name} />
            <DeleteFile id={id} />
          </CardActions>
        )}
      </Card>
    </>
  );
};

export default ImgCard;