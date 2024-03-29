// useUrlOperations.js
import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import UserContext from './userContext';

const useUrlOperations = () => {
  const router = useRouter();
  const [urls, setUrls] = useState([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const { userData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const handleCopyUrl = (url) => {
    const completeUrl = `http://localhost:3000/url/${userData.id}/${url}`;
    navigator.clipboard.writeText(completeUrl)
      .then(() => {
        toast.success('URL copied to clipboard!');
      })
      .catch((error) => {
        console.error('Error copying URL:', error);
        toast.error('Error copying URL');
      });
  };


  const handleGenerateShortUrl = () => {
    if (!originalUrl.trim()) {
      toast.error('Original URL is required');
      return;
    }

    if (!shortUrl.trim()) {
      toast.error('Short URL is required');
      return;
    }

    axios.post(
      'http://localhost:3000/url/create-url',
      { originalUrl, shortUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(response => {
        setOriginalUrl('');
        setShortUrl('')
        fetchUrls()
        toast.success('Short URL generated!');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
          setOriginalUrl('');
          setShortUrl('');
        }
      });
  };

  const fetchUrls = () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3000/url/users-custom-urls', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setUrls(response.data);
          setLoading(false);

        })
        .catch(error => {
          console.error('Error fetching URLs:', error);
          setLoading(true);

        });
    }
  };

  return {
    urls,
    originalUrl,
    setOriginalUrl,
    shortUrl,
    setShortUrl,
    handleCopyUrl,
    handleGenerateShortUrl,
    fetchUrls,
    loading
  };
};

export default useUrlOperations;
