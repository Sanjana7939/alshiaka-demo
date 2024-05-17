import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

const TablePaginationActions = ({ page, onPageChange, paginationToken, maxPageNo }) => {

  const handleBackButtonClick = (e) => {
    onPageChange(e, page - 1);
  };

  const handleNextButtonClick = (e) => {
    onPageChange(e, page + 1);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={!paginationToken && page === maxPageNo}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
}

export default TablePaginationActions;