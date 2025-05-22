import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

interface LittleFrameProps {
  imageUrl: string;
  title: string;
  description: string;
}

const LittleFrame: React.FC<LittleFrameProps> = ({ imageUrl, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: "100%",
        maxWidth: "300px",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease-in-out",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingBottom: "60%", // Reduced height-width ratio
        }}
      >
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Box sx={{ padding: "16px" }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default LittleFrame;