import { Box } from '@mui/material';
import ProductsList from './list';
import { ProductDetailsPanel } from './details';
import { ProductsProvider } from '../../context/ProductContext';
import useBreakpoints from '../../components/useBreakPoints';
import { checkRoleAccess } from '../../utils';

export default function Products() {
  const { isXs, isSm, isMd, isLg, isXl, isSidebarCollapseBreakPoint } = useBreakpoints();
  const responsiveFontSize = isXs ? '15px' : isSm ? '15px' : isMd ? '20px' : isLg ? '13px' : isXl ? '15px' : '18px';
  const userManagementPermissions = checkRoleAccess('USER MANAGEMENT'); 
  const styles = {
    container: {
      display: 'flex',
      backgroundColor: '#e2e2e2',
      width: isXs? '87%': '100%',
      height: '100%',
      flexDirection: isSm || isXs ? 'column' : 'row',
      px: 2,
      py: 1,
    },
    item: {
      backgroundColor: 'white',
      boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
      borderRadius: 1,
      height: '46%', 
      overflow: 'auto',
    },
    flex1: {
      flex: 1,
    },
    flexHalf: {
      flex: isSm || isXs ? 1 : 1 / 4,
      height: '100%', 
    },
    flexThree: {
      flex: isSm || isXs ? 1 : 3 / 4, 
      height: '100%', 
    },
  };
  if (userManagementPermissions.read===true){
  return (
    <ProductsProvider>
      
      <Box sx={styles.container}>
        <ProductsList
          sx={{
            ...styles.item,
            ...styles.flexHalf,
          }}
        />
        <ProductDetailsPanel
          sx={{
            ...styles.item,
            ...styles.flexThree,
            ml: isSm || isXs ? 0 : 2, 
            mt: isXs || isSm? 2 : 0,
            overflowY: 'auto', 
            '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#4870D6' }
          }}
        />
      </Box>
    </ProductsProvider>
  );
}
else {
  return (
    <div style={{padding: '20px' }}>
      <h1>Access Denied</h1>
      <p>You don't have access to this page. Please contact the administrator.</p>
    </div>
  );
}
}
