import { useEffect, useState } from "react"
import { Container, CssBaseline, Box, Typography, TextField, Button, Grid, Alert } from "@mui/material"
import axiosInstance from "../api/axios"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const navigate = useNavigate()

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
  })
  const [startProfile, setStartProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
  })
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken")

        const response = await axiosInstance.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setStartProfile({
          first_name: response.data.data.first_name,
          last_name: response.data.data.last_name,
          email: response.data.data.email
        })

        setProfile({
          first_name: response.data.data.first_name,
          last_name: response.data.data.last_name,
          email: response.data.data.email
        })
        setIsLoading(false)
      } catch (err: any) {
        console.error("Failed to fetch profile:", err.response?.data || err.message)
        setError("Failed to load profile. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleUpdate = async () => {
    if (!profile.email || !profile.first_name || !profile.last_name) {
      setError("Please fill in all required fields.")
      return
    }

    try {
      const token = localStorage.getItem("authToken")

      const response = await axiosInstance.put(
        "/profile",
        {
          user: {
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setSuccess("Profile updated successfully.")
      setPassword("")
      setPasswordConfirmation("")
      setStartProfile({
        first_name: response.data.data.first_name,
        last_name: response.data.data.last_name,
        email: response.data.data.email
      })
    } catch (err: any) {
      console.error("Failed to update profile:", err.response?.data || err.message)
      setError("Profile update failed. Please try again later.")
    }
  }

  const handleUpdatePassword = async () => {
    if (!password || !passwordConfirmation) {
      setError("Please fill in all required fields.")
      return
    }

    try {
      const token = localStorage.getItem("authToken")

      const response = await axiosInstance.put(
        "/password",
        {
          email: startProfile.email,
          password: password,
          password_confirmation: passwordConfirmation,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )

      setSuccess("Profile updated successfully.")
      setPassword("")
      setPasswordConfirmation("")
    } catch (err: any) {
      console.error("Failed to update profile:", err.response?.data || err.message)
      setError("Profile update failed. Please try again later.")
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <>
      <Container maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">My Profile</Typography>
          <Box sx={{ mt: 3, width: "100%" }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <TextField
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="First Name"
              value={profile.first_name}
              onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              id="last_name"
              label="Last Name"
              value={profile.last_name}
              onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleUpdate}
            >
              Update Profile Info
            </Button>

            <hr></hr>

            <TextField
              margin="normal"
              fullWidth
              id="password"
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              id="password_confirmation"
              label="Confirm New Password"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleUpdatePassword}
            >
              Set New Password
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button onClick={() => navigate("/items")}>Back to Items</Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Profile
