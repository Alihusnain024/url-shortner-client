import { useState,useContext } from 'react';
import { TextField, Button, Container, Grid, Typography, Link, Avatar, Paper, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../../utils/userContext';

const defaultTheme = createTheme();

export default function RegisterForm() {
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const { setIsRegistered} = useContext(UserContext);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        username: values.username,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email
      });
      setIsRegistered(true);
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
          setErrors(error.response.data.message);
      }
       else {
        toast.error('Registration failed. Please try again later.');
      }
    }
    setSubmitting(false);
  };

  const getFieldError = (fieldName) => {
    if (typeof errors === 'string') {
      return fieldName === 'username' ? errors : '';
    } else if (Array.isArray(errors)) {
      const fieldError = errors.find((error) => error.property === fieldName);
      return fieldError ? fieldError.message : '';
    } else {
      return '';
    }
  };

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
              Sign up
            </Typography>
            <Formik
              initialValues={{ username: '', password: '', firstName: '', lastName: '', email: '' }}
              validationSchema={Yup.object({
                username: Yup.string().required('Required'),
                password: Yup.string().required('Required'),
                firstName: Yup.string().required('Required'),
                lastName: Yup.string().required('Required'),
                email: Yup.string().required('Required'),
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
                    error={getFieldError('username')}
                    helperText={getFieldError('username')}
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
                    autoComplete="new-password"
                    error={getFieldError('password')}
                    helperText={getFieldError('password')}
                  />
                  <Field
                    as={TextField}
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
                    error={getFieldError('firstName')}
                    helperText={getFieldError('firstName')}
                  />
                  <Field
                    as={TextField}
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    error={getFieldError('lastName')}
                    helperText={getFieldError('lastName')}
                  />
                  <Field
                    as={TextField}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={getFieldError('email')}
                    helperText={getFieldError('email')}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing up...' : 'Sign Up'}
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link href="/login" variant="body2">
                        Already have an account? Sign in
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
