import { IconButton } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import DownloadIcon from '@mui/icons-material/Download'
import { useSelector } from "react-redux";
import { StoreType } from "../../store/store";
import apiClient from "../../apiClient";
import { SaveAltRounded } from "@mui/icons-material";

const Download = ({ path }: { path: string }) => {

    const [progress, setProgress] = useState(0);

    const currentUser = useSelector((state: StoreType) => state.auth.currentUser);

    const handleDownload = async () => {


        try {

            // שלב 1: בקשת URL חתום מהשרת
            const response = await apiClient.get('file/download-url', {
                params: {
                    userId: currentUser?.id,
                    path
                },
            });
            console.log(response);

            const url = response.data.url;

            // שלב 2: הורדת הקובץ מה-S3
            const downloadResponse = await axios.get(url, {
                responseType: "blob",
                onDownloadProgress: (progressEvent) => {
                    // const percent = Math.round(
                    //     (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    // );
                    // setProgress(percent);
                },
            });

            // יצירת קישור זמני להורדה
            const fileName = path.split('/').pop() || path;
            const downloadUrl = window.URL.createObjectURL(new Blob([downloadResponse.data]));
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <IconButton size="small" onClick={handleDownload}>
                <SaveAltRounded />
            </IconButton>
            {/* <button onClick={handleDownload}>download</button> */}
            {progress > 0 && <div>progress: {progress}%</div>}
        </div>
    );
};

export default Download;