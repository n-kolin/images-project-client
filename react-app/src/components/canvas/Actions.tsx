import { Button } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Text from "./Text";

const Actions = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [_, setRotate] = useState(0)
    const rotateLeft = () => {
        setRotate((prevRotate) => {
            const newRotate = prevRotate + 0.05;
            setRotateInParams(newRotate); // עדכון ה-URL עם הערך החדש
            return newRotate;
        });
    };
    
    const rotateRight = () => {
        setRotate((prevRotate) => {
            const newRotate = prevRotate - 0.05;
            setRotateInParams(newRotate); // עדכון ה-URL עם הערך החדש
            return newRotate;
        });
    };
    
    const setRotateInParams = (value: number) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("rotate", value.toString()); // שימוש בערך החדש
        navigate({ search: searchParams.toString() });
    };
    return (<>
        <Button onClick={rotateLeft}>
            ↪️
        </Button>
        <Button onClick={rotateRight}>
            ↩️
        </Button>
        <Text/>

    </>)
}

export default Actions;