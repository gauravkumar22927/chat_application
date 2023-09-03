import { Box, Typography } from "@mui/material"
import React from "react"

const MessageCard = ({ text, date, direction, imageUrl }) => {
  return (
    <Box display="flex" justifyContent={direction}>
      {direction === "end" && imageUrl && (
        <Box marginRight="10px">
          <img src={`http://localhost:4000${imageUrl}`} alt="Message_img" style={{ maxWidth: "150px", maxHeight: "150px" }} />
        </Box>
      )}
      <Box>
        <Typography variant="subtitle2" backgroundColor="white" padding="5px">
          {text}
        </Typography>
        <Typography variant="caption">{new Date(date).toLocaleTimeString()}</Typography>
      </Box>
      {direction === "start" && imageUrl && (
        <Box marginLeft="10px">
          <img src={`http://localhost:4000${imageUrl}`} alt="Message_img" style={{ maxWidth: "150px", maxHeight: "150px" }} />
        </Box>
      )}
    </Box>
  )
}

export default MessageCard
