import { Delete } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { softDeleteFile } from "../../store/filesSlice";

const DeleteFile = ({id} : {id:number}) => {

    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = async ()=>{
        try {
            const res = await dispatch(softDeleteFile(id))  
            console.log(res);
        }
        catch (e) {
            console.log(e);

        }
    }

    return (<>

        <IconButton size="small" onClick={handleDelete}>
            <Delete />
        </IconButton>

    </>)
}
export default DeleteFile