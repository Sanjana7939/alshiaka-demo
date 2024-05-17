/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import ListBox from '../../components/roles/list';
import {
  Add } from '@mui/icons-material';
import { ProductsContext } from '../../context/ProductContext';
import { AppContext } from '../../context/app-context';
import {allRoles} from '../../api/index'
import {
  Box,
  Stack, TextField, Typography, CircularProgress
} from '@mui/material';
import { AppConstants, colors } from '../../config/app-config';
import DialogBox from '../../components/roles/dialog-box';
import { notify, checkRoleAccess } from '../../utils';


export default function ProductsList({ ...attributes }) {
  const [loading, setLoading] = useState(false);
  const userManagementPermissions = checkRoleAccess('USER MANAGEMENT'); 
  const {
    selectedProduct,
    setSelectedProduct
  } = useContext(ProductsContext);
  const {rolesLoading, setRolesLoading} = useContext(AppContext)
  const [products, setProducts] = useState([]);
  const [addProductViewEnabled, setAddProductViewEnabled] = useState(false);
  const [prevSelected, setPrevSelected] = useState();

  useEffect(() => {
    if(rolesLoading){
      allRoles()
      .then(response => {
        // console.log("All roles are:", response);
        setProducts(response.roles);
        if (selectedProduct && rolesLoading) {
          const updatedSelectedProduct = response.roles.find(role => role.roleId === selectedProduct.roleId);
          setSelectedProduct(updatedSelectedProduct);
        }
      })
      .catch(error => {
        console.error('Error fetching data from all roles API:', error);
        notify(AppConstants.ERROR, 'Error fetching data from all roles API:');
      })
      .finally(() => {
        console.log("API call completed. Setting rolesLoading to false.");
        if (rolesLoading) {
            setRolesLoading(false);
        }
      });
    };
  }, [rolesLoading]);

  useEffect(() => {
    if (selectedProduct) setPrevSelected(selectedProduct);
  }, [selectedProduct]);

  const addProduct = () => {
    setAddProductViewEnabled(true);
    setSelectedProduct(null);
  };

  const handleClose = () => {
    setAddProductViewEnabled(false);
    setSelectedProduct(prevSelected);
  };

  if (rolesLoading ) {
    return (
      <Stack
        sx={{
          width: "100%",
          padding: " 0 0 3vh 0",
          justifyContent: "center",
          alignItems: "center",
          rowGap: "16px",
          columnGap: "16px",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Box {...attributes}>
      <ListBox sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        
      }}
      >
        <ListBox.HeaderWithIconAndSearchBar
          title="Roles"
          Icon= {userManagementPermissions.create ? Add : ''}
          onIconClick={addProduct}
        />
        {!loading
          && (
          <Stack flex={1} direction="column" alignContent="space-between" sx={{ overflow: 'hidden' }}>
            <ListBox.List
              flex={1}
              spacing={1}
              list={products}
              sx={{ overflowY: 'auto', borderRadius: 1, "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#4870D6" }, }}
            >
              {({ item, key }) => (
                <ProductCard key={key} product={item} />
              )}
            </ListBox.List>
          </Stack>
          )}
      </ListBox>
      {addProductViewEnabled && (
      <NewProductDialog open={addProductViewEnabled}
        handleClose={handleClose}
      />
      )}
    </Box>
  );
}

const NewProductDialog = ({ open, handleClose }) => (
  <DialogBox open={open} title="Create New Role" handleClose={handleClose}>
    {/* <ProductDetailsPanel {...{ open, handleClose }} /> */}
  </DialogBox>
);

const ProductCard = ({ product }) => {
  const {
    roleId
  } = product;

  console.log("123456", roleId)

  const { selectedProduct, setSelectedProduct } = useContext(ProductsContext);

  const handleClick = (item) => {
    setSelectedProduct(item);
  };
  return (
    <Stack
      sx={{
        cursor: 'pointer',
        ':hover': { backgroundColor: colors.lightBlue },
        backgroundColor: '#eeecfc',
        borderLeft: product?.roleId === selectedProduct?.roleId ? '6px solid blue' : '6px solid transparent',
        borderRadius: product?.roleId === selectedProduct?.roleId ? 1 : '',
      }}
      direction="row"
      alignContent="center"
      justifyContent="space-between"
      onClick={() => handleClick(product)}
    >
      <Stack direction="column" sx={{ py: 1, px: 2 }}>
        <Typography variant="caption">{roleId}</Typography>
        {/* <Typography variant="caption">{role_desc}</Typography> */}
      </Stack>
    </Stack>
  );
};
