import React, { useState } from "react";
import { Button, TextField, Slider, Checkbox, FormControlLabel } from "@mui/material";
import { useLocation, useNavigate } from "react-router";

const Text: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [text, setText] = useState<string>("");
  const [fill, setFill] = useState<boolean>(false);
  const [stroke, setStroke] = useState<boolean>(false);
  const [fillColor, setFillColor] = useState<string>("#000000");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const [xPosition, setXPosition] = useState<number>(50);
  const [opacity, setOpacity] = useState<number>(1); // ערך השקיפות

  // פונקציה לעדכון ה-URL
  const setParamInUrl = (key: string, value: string | number | boolean) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value.toString());
    navigate({ search: searchParams.toString() });
  };

  // פונקציות לעדכון המאפיינים
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setText(newText);
    setParamInUrl("text", newText);
  };

  const handleFillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFill((prevFill) => {
      const newFill = event.target.checked;
      setParamInUrl("fill", newFill);
      return newFill;
    });
  };

  const handleStrokeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStroke((prevStroke) => {
      const newStroke = event.target.checked;
      setParamInUrl("stroke", newStroke);
      return newStroke;
    });
  };

  const handleFillColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFillColor = event.target.value;
    setFillColor(newFillColor);
    setParamInUrl("fillColor", newFillColor);
  };

  const handleStrokeColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStrokeColor = event.target.value;
    setStrokeColor(newStrokeColor);
    setParamInUrl("strokeColor", newStrokeColor);
  };

  const handleXPositionChange = (_: Event, newValue: number | number[]) => {
    setXPosition((prevXPosition) => {
      const newXPosition = newValue as number;
      setParamInUrl("xPosition", newXPosition);
      return newXPosition;
    });
  };

  const handleOpacityChange = (_: Event, newValue: number | number[]) => {
    setOpacity((prevOpacity) => {
      const newOpacity = newValue as number;
      setParamInUrl("opacity", newOpacity);
      return newOpacity;
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Text Editor</h2>
      <div>
        <TextField
          label="Add Text"
          value={text}
          onChange={handleTextChange}
          fullWidth
          margin="normal"
        />
      </div>
      <div>
        <FormControlLabel
          control={<Checkbox checked={fill} onChange={handleFillChange} />}
          label="Fill"
        />
        <FormControlLabel
          control={<Checkbox checked={stroke} onChange={handleStrokeChange} />}
          label="Stroke"
        />
      </div>
      <div>
        <label htmlFor="fill-color">Fill Color:</label>
        <input
          type="color"
          id="fill-color"
          value={fillColor}
          onChange={handleFillColorChange}
          style={{ marginLeft: "10px", marginRight: "20px" }}
        />

        <label htmlFor="stroke-color">Stroke Color:</label>
        <input
          type="color"
          id="stroke-color"
          value={strokeColor}
          onChange={handleStrokeColorChange}
          style={{ marginLeft: "10px" }}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>Move Text Left/Right:</label>
        <Slider
          value={xPosition}
          onChange={handleXPositionChange}
          aria-labelledby="x-position-slider"
          min={0}
          max={100}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>Opacity:</label>
        <Slider
          value={opacity}
          onChange={handleOpacityChange}
          aria-labelledby="opacity-slider"
          min={0}
          max={1}
          step={0.01} // רזולוציה של השקיפות
        />
      </div>
    </div>
  );
};

export default Text;