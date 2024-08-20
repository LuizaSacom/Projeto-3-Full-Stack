import React from 'react';
import Button from '@mui/material/Button';
import { useCategory } from '../context/CategoryContext';

function CategoryButton({ category }) {
  const { handleCategoryClick } = useCategory();
  return (
    <Button variant="contained" color="primary" onClick={() => handleCategoryClick(category)}>
      {category}
    </Button>
  );
}

export default CategoryButton;