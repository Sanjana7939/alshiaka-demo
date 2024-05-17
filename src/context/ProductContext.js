/* eslint-disable no-unused-vars */
import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { AppContext } from './app-context';
import { AppConstants, notify } from '../config/app-config';

const ProductsContext = createContext();

const ProductsProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const updateSelectedProduct = useCallback((updatedProduct) => {
    setSelectedProduct(updatedProduct);
  }, [setSelectedProduct]);
  const { user } = useContext(AppContext);


  const clearProductsContext = useCallback(() => {
    setSelectedProduct(null);
    setAllProducts(null);
    setIsAddNewGrpEnabled(false);
    setCategories(null);
  }, []);


  const contextValue = useMemo(
    () => ({
      currentPage,
      setCurrentPage,
      // setIsAddNewGrpEnabled,
      selectedProduct,
      setSelectedProduct,
      allProducts,
      setAllProducts,
      categories,
      setCategories,
      clearProductsContext,
      updateSelectedProduct,
    }),
    [allProducts, categories, clearProductsContext, currentPage,
      selectedProduct, updateSelectedProduct],
  );

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};

export { ProductsContext, ProductsProvider };
