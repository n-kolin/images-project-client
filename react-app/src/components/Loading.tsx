import { Typography } from "@mui/material";
import './Loading.css'
const Loading = () => {
    return (<>
        <div className="loader-overlay">
            <div className="loadingio-spinner-spin-nq4q5u6dq7r">
                <div className="ldio-x2uulkbinbj">
                    <div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div>
                </div>
            </div>
            <Typography variant="h5" color="#f2f2f2">
                Good things take time... Loading your files!
            </Typography>
        </div >
    </>)
}
export default Loading;