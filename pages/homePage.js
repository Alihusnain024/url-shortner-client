import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withAuth from '../utils/withAuth';
import { useRouter } from 'next/router';
import UserContext from '../utils/userContext';
import Navbar from '../src/components/NavBar';
import Typography from '@mui/material/Typography';
import Pagination from '../src/components/Pagination';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useUrlOperations from '../utils/urlData';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';

function HomePage() {
  const router = useRouter();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const { isLoggedIn } = useContext(UserContext);
  const { setIsLoggedIn } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const {
    originalUrl,
    setOriginalUrl,
    handleCopyUrl,
  } = useUrlOperations();

  const handleGenerateShortUrl = () => {
    axios.post(
      'http://localhost:3000/url/create-url',
      { originalUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(response => {
        setOriginalUrl('');
        fetchUrls();
        toast.success('Short URL generated!');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
          setOriginalUrl('');
        }
      });
  };

  const handleDeleteUrl = async (shortUrl) => {
    try {
      const response = await axios.delete(`http://localhost:3000/url/delete/${shortUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('URL deleted successfully!');
      fetchUrls();
      if (paginatedUrls.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  const fetchUrls = () => {
    setLoading(true); // Set loading state to true when fetching URLs
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3000/url/users-urls', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setUrls(response.data);
          setLoading(false); // Set loading state to false after URLs are fetched
        })
        .catch(error => {
          console.error('Error fetching URLs:', error);
          setLoading(false); // Set loading state to false in case of error
        });
    }
  };

  useEffect(() => {
    fetchUrls();
    if (isLoggedIn) {
      toast.success('Welcome! Successfully logged in.');
    }
    setIsLoggedIn(false);
  }, [isLoggedIn]);

  const pageCount = Math.ceil(urls.length / pageSize);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedUrls = urls.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <Navbar />
      <Box textAlign="center">
        <Box mb={2} mt={2}>
          <TextField
            type="text"
            label="Enter original URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            variant="outlined"
            style={{ marginRight: '10px' }}
          />
          <Button style={{ height: '56px' }} variant="contained" color="primary" onClick={handleGenerateShortUrl}>Generate Short URL</Button>
        </Box>

        {loading ? (
          <CircularProgress />
                  ) : (
          urls.length > 0 ? (
            <TableContainer sx={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography fontWeight="bold">Original URL</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Short URL</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Click Count</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Actions</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUrls.map((url, index) => (
                    <TableRow key={index}>
                      <TableCell>{url.originalUrl}</TableCell>
                      <TableCell>{url.shortUrl}</TableCell>
                      <TableCell>{url.clickCount}</TableCell>
                      <TableCell>
                        <IconButton aria-label="delete" onClick={() => handleDeleteUrl(url.shortUrl)}>
                          <DeleteIcon style={{ color: 'red' }} />
                        </IconButton>
                        <IconButton aria-label="copy" onClick={() => handleCopyUrl(url.shortUrl)}>
                          <FileCopyIcon style={{ color: '#007bff' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              marginTop={15}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              {urls.length === 0 && (
                <Image
                  src="/urlImage.jpg"
                  alt="Downloaded Picture"
                  width={250}
                  height={250}
                />
              )}
              <Typography variant="h5" mt={5}>
                No URLs available. You can generate your short URL by giving the URL above.
              </Typography>
            </Box>
          )
        )}

        {!loading && urls.length > 0 && (
          <Box>
            <Pagination
              pages={pages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </Box>
        )}

      </Box>
      <ToastContainer />
    </>
  );
}
export default withAuth(HomePage);
