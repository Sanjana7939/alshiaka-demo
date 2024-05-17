import { toast } from "react-toastify";
import { AppTheme } from "./theme";

export const notify = (type, message) => {
  toast.dismiss();
  toast(message, { type, delay: 0 });
};



export const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const getComparator = (order, orderBy) =>
  order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);



export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};


export const ScrollbarDesign = {
  '&::-webkit-scrollbar': {
    width: '12px',
    height: '12px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: AppTheme.scrollbarColor,
    borderRadius: '20px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: AppTheme.scrollbarBackground,
  }
}


export const checkRoleAccess = (operationDesc) => {
  const data = JSON.parse(localStorage.getItem("userRoleManagement"));

  if (!data) {
    return {
      create: false,
      read: false,
      update: false,
      delete: false,
    };
  }

  const role = data.roles[0];
  const operation = role.operations.find((op) => op.operationDesc === operationDesc);

  return {
    create: operation?.create ?? false,
    read: operation?.read ?? false,
    update: operation?.update ?? false,
    delete: operation?.delete ?? false,
  };

};


export const muiDateFormat = "DD/MM/YY hh:mm A"
