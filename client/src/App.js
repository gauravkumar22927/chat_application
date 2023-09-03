//import logo from "./logo.svg"
import { useState } from "react"
import "./App.css"
import AuthScreen from "./pages/AuthScreen"
import HomeScreen from "./pages/HomeScreen"

function App() {
  const [loggedIn, setloggedIn] = useState(localStorage.getItem("jwt") ? true : false)
  return <>{loggedIn ? <HomeScreen setloggedIn={setloggedIn} /> : <AuthScreen setloggedIn={setloggedIn} />}</>
}

export default App
