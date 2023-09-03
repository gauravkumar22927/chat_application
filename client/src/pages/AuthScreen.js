import React, { useState, useRef } from "react"

import Box from "@mui/material/Box"
import { CircularProgress } from "@mui/material"
import Card from "@mui/material/Card"
import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { useMutation } from "@apollo/client"

import { SIGNUP_USER } from "../graphql/mutations"
import { LOGIN_USER } from "../graphql/mutations"

const AuthScreen = ({ setloggedIn }) => {
  const [showLogin, setShowLogin] = useState(true)
  const [formData, setFormData] = useState({})
  const authForm = useRef(null)

  const [signupUser, { loading: l1, error: e1, data: signupData }] = useMutation(SIGNUP_USER, {
    onError(error) {
      if (error.message) {
        // Handle other GraphQL errors
        //console.error("An error occurred", error.message)
      }
    },
  })
  const [loginUser, { loading: l2, error: e2, data: loginData }] = useMutation(LOGIN_USER, {
    onCompleted(data) {
      localStorage.setItem("jwt", data.signinUser.token)
      setloggedIn(true)
    },
    onError(error) {
      if (error.message) {
        // Handle other GraphQL errors
        // console.error("An error occurred :", error.message)
      }
    },
  })

  if (l1 || l2) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress />
          <Typography variant="h6">Authenticating...</Typography>
        </Box>
      </Box>
    )
  }
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      if (showLogin) {
        loginUser({
          variables: {
            userSignin: formData,
          },
        })
      } else {
        signupUser({
          variables: {
            userNew: formData,
          },
        })
      }
    } catch (error) {
      console.error("An error occurred:", error)
    }
  }
  return (
    <Box ref={authForm} component="form" onSubmit={handleSubmit} display="flex" justifyContent="center" alignItems="center" height="80vh">
      <Card varient="outlined" sx={{ padding: "10px" }}>
        <Stack direction="column" spacing={2} sx={{ width: "400px" }}>
          {signupData && <Alert severity="success">{signupData.signupUser.firstName} Signed Up</Alert>}
          {e1 && <Alert severity="error">{e1.message}</Alert>}
          {e2 && <Alert severity="error">{e2.message}</Alert>}

          <Typography variant="h5">Please {showLogin ? "Login" : "Signup"}</Typography>
          {!showLogin && (
            <>
              <TextField name="firstName" label="First Name" variant="standard" onChange={handleChange} required />
              <TextField name="lastName" label="Last Name" variant="standard" onChange={handleChange} required />
            </>
          )}
          <TextField name="email" type="email" label="email" variant="standard" onChange={handleChange} required />
          <TextField name="password" type="password" label="password" variant="standard" onChange={handleChange} required />
          <Typography
            textAlign="center"
            varient="subtitle1"
            onClick={() => {
              setShowLogin((preValue) => !preValue)
              setFormData({})
              authForm.current.reset()
            }}
          >
            {showLogin ? "Signup?" : "Login?"}
          </Typography>
          <Button variant="outlined" type="submit">
            {showLogin ? "Login" : "Signup"}
          </Button>
        </Stack>
      </Card>
    </Box>
  )
}

export default AuthScreen
