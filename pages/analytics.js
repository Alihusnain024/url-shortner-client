import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../src/components/NavBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Icon } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import LinkIcon from '@mui/icons-material/Link';
import TocIcon from '@mui/icons-material/Toc';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useAnalyticsData from '../utils/analyticsData';
import withAuth from '../utils/withAuth';

const AnalyticsPage = () => {
  const { counts, clicks } = useAnalyticsData();
  return (
    <div>
      <Navbar />
      <Box display="flex" mt={3}>
        <Box flex={1} m={2} p={2} border={1} borderRadius={16} borderColor="primary.main" color="black" textAlign="center">
          <TocIcon fontSize="large" />
          <Typography variant="h6">Total URLs</Typography>
          <Typography variant="h4">{counts.total}</Typography>
        </Box>
        <Box flex={1} m={2} p={2} border={1} borderRadius={16} borderColor="secondary.main" color="black" textAlign="center">
          <LinkIcon fontSize="large" />
          <Typography variant="h6">Custom URLs</Typography>
          <Typography variant="h4">{counts.custom}</Typography>
        </Box>
        <Box flex={1} m={2} p={2} border={1} borderRadius={16} borderColor="info.main" color="black" textAlign="center">
          <FileCopyIcon fontSize="large" />
          <Typography variant="h6">Non-Custom URLs</Typography>
          <Typography variant="h4">{counts.nonCustom}</Typography>
        </Box>
      </Box>
      <Box mt={3} mx="auto" width="80%">
        <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={500}
          height={300}
          data={[
            { name: 'Total Clicks', totalClicks: clicks.totalClicks },
            { name: 'Custom URL Clicks', customUrlClicks: clicks.customUrlClicks },
            { name: 'Non-Custom URL Clicks', nonCustomUrlClicks: clicks.nonCustomUrlClicks }
          ]}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis  domain={[0, 'auto']}/>
          <Tooltip />
          <Legend />
          <Bar dataKey="totalClicks" name="Total Clicks" fill="#8884d8" />
          <Bar dataKey="customUrlClicks" name="Custom URL Clicks" fill="#82ca9d" />
          <Bar dataKey="nonCustomUrlClicks" name="Non-Custom URL Clicks" fill="#ffc658" />
        </BarChart>
        </ResponsiveContainer>
      </Box>
    </div>
  );
};

export default withAuth(AnalyticsPage);
