import React from "react"

import Box from "@mui/material/Box"
import SideBar from "../components/SideBar"
import { Routes, Route } from "react-router-dom"
import Welcome from "../components/welcome"
import ChatScreen from "../components/chatScreen"

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />

      <Route path="/:id/:name" element={<ChatScreen />} />
    </Routes>
  )
}
const HomeScreen = ({ setloggedIn }) => {
  return (
    <Box display="flex">
      <SideBar setloggedIn={setloggedIn} />
      <AllRoutes />
    </Box>
  )
}

export default HomeScreen
