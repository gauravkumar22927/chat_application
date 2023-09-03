import { Box, Stack, TextField, Typography } from "@mui/material"
import React, { useState, useRef } from "react"
import { useParams } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Avatar from "@mui/material/Avatar"
import MessageCard from "./MessageCard"
import { useMutation, useQuery, useSubscription } from "@apollo/client"
import { GET_MSG } from "../graphql/queries"
import SendIcon from "@mui/icons-material/Send"
import ImageIcon from "@mui/icons-material/Image"
import { SEND_MSG } from "../graphql/mutations"
import { MSG_SUB } from "../graphql/subscription"

const ChatScreen = () => {
  const { id, name } = useParams()
  const [text, setText] = useState("")
  const [messages, setMessages] = useState([])
  const [image, setImage] = useState(null)
  const [error_msg, setError] = useState("") //error on empty text or image

  const handleSendMessage = async () => {
    if (!text && !image) {
      setError("Please enter a message or attach an image.")
      return
    }

    if (image) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
      if (!allowedTypes.includes(image.type)) {
        console.log("error hai check karo")
        setError("Please select a valid image file (JPEG, JPG, or PNG).")
        return
      }
    }

    try {
      // Send the message using the sendMessage function
      await sendMessage({
        variables: {
          receiverId: +id,
          text: text,
          image: image,
        },
      })

      // Clear the text and image inputs
      setText("")
      setImage(null)
    } catch (error) {
      console.error("Error sending message:", error)
      setError("An error occurred while sending the message.")
    }

    // Clear the text and error
    setText("")
    setImage(null)
    setError("")
  }

  const fileInputRef = useRef(null)

  const handleImageIconClick = () => {
    fileInputRef.current.click()
  }

  const { data, loading, error } = useQuery(GET_MSG, {
    variables: {
      receiverId: +id, // to convert to int
    },
    onCompleted(data) {
      setMessages(data.messagesByUser)
    },
  })

  const [sendMessage] = useMutation(SEND_MSG, {
    optimisticResponse: {
      __typename: "Mutation",
      createMessage: {
        __typename: "Message",
        id: Date.now(), // Generate a temporary ID
        text: text,
        imageUrl: image ? URL.createObjectURL(image) : null,
        receiverId: +id,
        senderId: null, // Assuming senderId is not needed here
        createdAt: new Date().toISOString(),
      },
    },
    context: {
      headers: {
        enctype: "multipart/form-data",
      },
    },
  })

  const { data: sub_data } = useSubscription(MSG_SUB, {
    onSubscriptionData({ subscriptionData: { data } }) {
      setMessages((prevMsgs) => [...prevMsgs, data.messageAdded])
    },
  })
  return (
    <Box flexGrow={1}>
      <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: 0 }}>
        <Toolbar>
          <Avatar src={`https://api.dicebear.com/api/initials/${name}.svg`} sx={{ width: "32px", height: "32px", mr: 2 }} />
          <Typography variant="h6" color="black">
            {name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box backgroundColor="#f5f5f5" height="80vh" padding="10px" sx={{ overflowY: "auto" }}>
        {loading ? (
          <Typography variant="h6">loading chat</Typography>
        ) : (
          messages.map((msg) => {
            return <MessageCard key={msg.createdAt} text={msg.text} date={msg.createdAt} direction={msg.receiverId === +id ? "end" : "start"} imageUrl={msg.imageUrl} />
          })
        )}
      </Box>
      <Stack direction="row" alignItems="flex-end">
        <TextField placeholder="Enter a message" variant="standard" fullWidth multiline rows={2} value={text} onChange={(e) => setText(e.target.value)} />
        <ImageIcon fontSize="large" style={{ cursor: "pointer" }} onClick={handleImageIconClick} />
        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={(e) => setImage(e.target.files[0])} />
        <SendIcon fontSize="large" onClick={handleSendMessage} style={{ cursor: "pointer" }} />
        {error_msg && <p style={{ color: "red" }}>{error_msg}</p>}
      </Stack>
    </Box>
  )
}

export default ChatScreen
