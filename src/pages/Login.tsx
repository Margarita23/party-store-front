import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Alert
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from '../api/axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")

  const navigate = useNavigate();

  const handleLogin = async () => {

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axiosInstance.post('/login', {
        user: {
          email,
          password,
        }
      });
  
      const { token } = response.data;
  
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', response.data?.data?.role || "user");
      localStorage.setItem('cart', JSON.stringify({}));

      navigate("/items");
  
    } catch (error: any) {
      setError(error.response.data.error)
    }

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
          <Typography variant="h5">Login</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Grid container justifyContent={"flex-end"}>
              <Grid item>
                <Link to="/register">Don't have an account? Register</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
