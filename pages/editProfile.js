import React, { useEffect, useState } from 'react';
import Navbar from '../src/components/NavBar';
import withAuth from '../utils/withAuth';
import { Container, Typography, Box, Grid, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';

const EditProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:3000/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push('/profile');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrors(error.response.data.message);
      }
      console.error('Error updating user profile:', error);
    }
  };

  const getFieldError = (fieldName) => {
    const fieldError = errors.find((error) => error.property === fieldName);
    return fieldError ? fieldError.message : '';
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="md">
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            Edit Profile
          </Typography>
          {user && (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    name="username"
                    label="Username"
                    variant="outlined"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    error={getFieldError('username')}
                    helperText={getFieldError('username')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    error={getFieldError('email')}
                    helperText={getFieldError('email')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    variant="outlined"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    error={getFieldError('firstName')}
                    helperText={getFieldError('firstName')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    variant="outlined"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    error={getFieldError('lastName')}
                    helperText={getFieldError('lastName')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Update
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default withAuth(EditProfilePage);
