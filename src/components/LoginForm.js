import { useState,useContext,useEffect } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Container, Grid, Typography, Link, Avatar, Checkbox, FormControlLabel, Paper, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../../utils/userContext';
import {jwtDecode} from 'jwt-decode';


const defaultTheme = createTheme();

export default function LoginForm() {
  const router = useRouter();
  const { setIsLoggedIn } = useContext(UserContext);
  const {isRegistered, setIsRegistered} = useContext(UserContext);
  const { setUserData} = useContext(UserContext);
  const { userData } = useContext(UserContext);
  console.log(isRegistered);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username: values.username, password: values.password });
      localStorage.setItem('token', response.data.access_token);
      const token = response.data.access_token;
      const decodedToken = jwtDecode(token);
      const username = decodedToken.username;
      const isAdmin = decodedToken.isAdmin;
      const id = decodedToken.sub;
      setUserData({username, isAdmin, id});
      localStorage.setItem('userData', JSON.stringify({username: username, isAdmin: isAdmin,id: id}));
      setIsLoggedIn(true);
      if(isAdmin){
        router.push('/dashboard');
      }
      else{
        router.push('/homePage');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred during login.');
      }
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (isRegistered) {
      toast.success('User sucessfully registered');
    }
    setIsRegistered(false);
  }, [isRegistered]);


  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={Yup.object({
                username: Yup.string().required('Username is required'),
                password: Yup.string().required('Password is required'),
              })}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    as={TextField}
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                  />
                  <Field
                    as={TextField}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <Grid container>
                    <Grid item xs>
                    </Grid>
                    <Grid item>
                      <Link href="/register" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </ThemeProvider>
  );
}
