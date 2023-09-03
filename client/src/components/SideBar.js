import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import UserCard from "./UserCard"
import LogoutIcon from "@mui/icons-material/Logout"
import Stack from "@mui/material/Stack"
import { GET_ALL_USERS } from "../graphql/queries"
import { useQuery } from "@apollo/client"

const SideBar = ({ setloggedIn }) => {
  const { loading, data, error } = useQuery(GET_ALL_USERS)

  if (loading) return <Typography variant="h6">Loading chats...</Typography>
  if (error) {
    console.log(error)
  }
  return (
    <Box backgroundColor="#f7f7f7" height="100vh" width="250px" padding="10px">
      <Stack direction="row" justifyContent="space-between">
        <Typography varient="h6">Chat</Typography>
        <LogoutIcon
          onClick={() => {
            localStorage.removeItem("jwt")
            setloggedIn(false)
          }}
        />
      </Stack>
      <Divider />
      {data.users.map((item) => {
        return <UserCard key={item.id} item={item} />
      })}
    </Box>
  )
}

export default SideBar
