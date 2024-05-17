import SearchIcon from '@mui/icons-material/Search';
import SelectCategory from '../dashboard/filters/selectcategory';
import SelectStatus from '../dashboard/filters/selectstatus';
import SelectStartDate from '../dashboard/filters/selectstartdate';
import SelectEndDate from '../dashboard/filters/selectenddate';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/app-context';
import CloseIcon from '@mui/icons-material/Close';
import { AppTheme } from '../../utils/theme';
import { CircularProgress, Grid, Stack, IconButton, Typography } from '@mui/material';
import useBreakpoints from '../useBreakPoints';
import FilterAltSharpIcon from '@mui/icons-material/FilterAltSharp';

export default function Search() {
  const {
    setDashboardLoading,
  } = useContext(AppContext);

  const { isXs, isSm, isMd, isLg, isXl, isSidebarCollapseBreakPoint } = useBreakpoints();
  const responsiveFontSize = isXs ? "15px" : isSm ? "15px" : isMd ? "20px" : isLg ? "13px" : isXl ? "15px" : "18px";
  const [filterOptionsVisible, setFilterOptionsVisible] = useState(false || window.innerWidth > 750);

  const handleClick = () => {
    console.log('clickkkkkkkkkkkk===========')
    setDashboardLoading(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 750) setFilterOptionsVisible(true);
      else setFilterOptionsVisible(false);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleFilterClick = () => {
    setFilterOptionsVisible(!filterOptionsVisible);
  };

  return (
    <>
      {isSidebarCollapseBreakPoint && (
        <Stack paddingRight="12px" width="100%" direction="row" alignItems="center" justifyContent="flex-end" paddingTop="7px">
          <IconButton onClick={handleFilterClick} sx={{ backgroundColor: AppTheme.primary, color: 'white' }} size='medium'>
            {filterOptionsVisible ? <CloseIcon sx={{ fontSize: responsiveFontSize }} /> : <FilterAltSharpIcon sx={{ fontSize: responsiveFontSize }} />}
          </IconButton>
        </Stack>)
      }
      {filterOptionsVisible && (
        <Stack alignItems="center" width="100%" sx={{ padding: "0 16px" }}>
          <Grid
            container
            direction={isXs ? "column" : "row"}
            rowGap="1px"
            columns={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
            alignItems="center"
            justifyContent='center'
          >
            <Grid item sx={{ padding: "4px" }}>
              <SelectCategory />
            </Grid>
            <Grid item sx={{ padding: "4px" }}>
              <SelectStatus />
            </Grid>
            <Grid item sx={{ padding: "4px" }}>
              <SelectStartDate />
            </Grid>
            <Grid item sx={{ padding: "4px" }}>
              <SelectEndDate />
            </Grid>
            <Grid item sx={{ padding: "8px" }}>
              <Stack style={{ alignItems: 'center' }}>
                <Stack onClick={handleClick} sx={{
                  backgroundColor: AppTheme.primary,
                  mt: 1, padding: 1, borderRadius: 1,
                  cursor: 'pointer',
                  width: isSm || isXs ? 200 : 40,
                  color: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                  <SearchIcon sx={{ height: 25, width: 25 }} />
                  <Typography>{isSm || isXs ? "Search" : ""}</Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Stack>)
      }
    </>
  );
}