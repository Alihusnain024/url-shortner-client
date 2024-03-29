import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../src/components/NavBar';
import withAuth from '../utils/withAuth';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton,Box,Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import UserContext from '../utils/userContext';
import Pagination from '../src/components/Pagination';

const DashboardPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const { isLoggedIn } = useContext(UserContext);
  const { setIsLoggedIn } = useContext(UserContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/users/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserCount(response.data.userCount);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('User deleted successfully!');
      fetchData();
      if (paginatedUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    fetchData();
    if (isLoggedIn) {
      toast.success('Welcome! Successfully logged in.');
    }
    setIsLoggedIn(false);
  }, [isLoggedIn]);

  const pageCount = Math.ceil(users.length / pageSize);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <Navbar />
      <Box mt={3} mb={3} borderColor="primary.main" color="black" textAlign="center">
      <div style={{ display: 'flex', justifyContent:'center' }}>
        <Typography variant="h5" mr={2}>Total Users</Typography>
        <Typography variant="h5">{userCount}</Typography>
      </div>
      </Box>
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>
              <Typography fontWeight="bold">UserId</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">Username</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">Email</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">Actions</Typography>
            </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <IconButton aria-label="delete" onClick={() => handleDeleteUser(user.id)}>
                      <DeleteIcon style={{ color: 'red' }}/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ToastContainer />
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            pages={pages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Box>
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);
