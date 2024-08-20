import React, { createContext, useState, useContext } from 'react';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [currentCategory, setCurrentCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
  };

  return (
    <CategoryContext.Provider value={{ currentCategory, handleCategoryClick }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);