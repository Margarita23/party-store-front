
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  Alert
} from "@mui/material"
import { LockOutlined } from "@mui/icons-material"
import { useState } from "react"
import { Link } from "react-router-dom"
import axiosInstance from '../api/axios'
import { useNavigate } from "react-router-dom"

const Register = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!firstName || !email || !password || !passwordConfirmation) {
      setError("Please fill in all fields.")
      return
    }
  
    try {
      const response = await axiosInstance.post(
         "/signup",
        {
          user: {
            first_name: firstName,
            last_name: lastName || "",
            email: email,
            password: password,
            password_confirmation: passwordConfirmation
          },
        }, {
          headers: {
            Accept: 'application/json',
          }
        }
      );

      const { token } = response.data
  
      localStorage.setItem('authToken', token);

      navigate("/items")
    } catch(error: any) {
      setError(error.response.data.error)
    };

  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        {error && <Alert severity="error">{error}</Alert>}
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Register</Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="first_name"
                  required
                  fullWidth
                  id="first_name"
                  label="First Name"
                  autoFocus
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="last_name"
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  autoFocus
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password_confirmation"
                  label="Password confirmation"
                  type="password"
                  id="password-confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
              </Grid>

            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleRegister}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login">Already have an account? Login</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;
