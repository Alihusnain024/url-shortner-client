import React, { useEffect, useState } from 'react';
import axios from 'axios';

const useAnalyticsData = () => {
  const [counts, setCounts] = useState({ total: 0, custom: 0, nonCustom: 0 });
  const [clicks, setClicks] = useState({ totalClicks: 0, customUrlClicks: 0, nonCustomUrlClicks: 0 });

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/url/url-counts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCounts(response.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const fetchClicks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/url/url-clicks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClicks(response.data);
    } catch (error) {
      console.error('Error fetching clicks:', error);
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchClicks();
  }, []);

  return { counts, clicks };
};

export default useAnalyticsData;
