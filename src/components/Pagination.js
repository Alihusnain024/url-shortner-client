import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Pagination = ({ pages, currentPage, handlePageChange }) => {
  return (
    <Box mt={2}>
      {pages.length > 1 && pages.map(page => (
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          style={{
            marginRight: '5px',
            backgroundColor: currentPage === page ? '#007bff' : '#ffffff',
            color: currentPage === page ? '#ffffff' : '#000000',
            borderRadius: '5px',
            border: '1px solid #007bff',
            padding: '5px 10px',
            cursor: 'pointer',
          }}
        >
          {page}
        </Button>
      ))}
    </Box>
  );
};

export default Pagination;
