import React from "react"
import Stack from "@mui/material/Stack"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import { useNavigate } from "react-router-dom"

const UserCard = ({ item: { firstName, lastName, id } }) => {
  const fullName = `${firstName} ${lastName}`
  const encodedFullName = encodeURIComponent(fullName)
  const navigate = useNavigate()
  return (
    <Stack className="usercard" direction="row" spacing={2} sx={{ py: 1 }} onClick={() => navigate(`/${id}/${firstName} ${lastName}`)}>
      <Avatar src={`https://api.dicebear.com/api/initials/${encodedFullName}.svg`} sx={{ width: "32px", height: "32px" }} />
      <Typography variant="subtitle2">
        {firstName} {lastName}
      </Typography>
    </Stack>
  )
}

export default UserCard
