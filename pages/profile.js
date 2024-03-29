import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Navbar from '../src/components/NavBar';
import withAuth from '../utils/withAuth';
import { Container, Typography, Box, Avatar, Grid, Button, Divider, TextField } from '@mui/material';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

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
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <div>
      <Navbar />
      <Container maxWidth="md">
        <Box mt={4} ml={35}>
          <Typography variant="h4" gutterBottom>
            User Profile
          </Typography>
          {user && (
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Avatar alt={user.username} src="/static/images/avatar/1.jpg" sx={{ width: 120, height: 120 }} />
              </Grid>
              <Grid item xs={12} sm={6} ml={1}>
                <Typography variant="h6">Username:</Typography>
                <Typography>{user.username}</Typography>
                <Divider />
                <Typography variant="h6">First Name:</Typography>
                <Typography>{user.firstName}</Typography>
                <Divider />
                <Typography variant="h6">Last Name:</Typography>
                <Typography>{user.lastName}</Typography>
                <Divider />
                <Typography variant="h6">Email:</Typography>
                <Typography>{user.email}</Typography>
                <Divider />
                <Box mt={3} ml={13}>
                <Link href="/editProfile" passHref>
                  <Button variant="contained" color="primary">Edit</Button>
                </Link>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default withAuth(ProfilePage);
