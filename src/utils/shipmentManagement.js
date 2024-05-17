import dayjs from 'dayjs';
import { AppConstants } from '../config/app-config';
import Papa from 'papaparse';
import { notify } from '.';

export const DATE_COLUMNS = ['boe_clearing_date', 'do_validity', 'last_date_at_port', 'placement_time', 'dc_entry_time', 'dc_exit_time', 'unloading_start_time', 'unloading_end_time', 'instore_date'];
export const MAX_STRING_LENGTH = 25;

export const isLongString = (value) => {
    return (value && value.toString().length > MAX_STRING_LENGTH)
}

export const getUAEDateTime = (timestamp) => {
    return dayjs(timestamp).tz(AppConstants.TIMEZONE).format('DD/MM/YY hh:mm A');
}

export const getUAEDate = (timestamp) => {
    return dayjs(timestamp).tz(AppConstants.TIMEZONE).format('DD/MM/YYYY');
}

export const getEntityDesc = (column, entityID, dcList, dockList, facilityList, transporterList) => {
    let list = []
    if (column === 'location') {
        list = dcList
    }
    if (column === 'dock') {
        list = dockList
    }
    if (column === 'facility_id') {
        list = facilityList
    }
    if (column === 'transporter') {
        list = transporterList
    }

    for(const e of list) {
        if (entityID === e.entityID) {
            return e.entityDesc;
        }
    }
}

export const renderTableCell = (column, value) => {
    if (DATE_COLUMNS.includes(column) && value && value != '') {
        return getUAEDateTime(value)
    }
    if (DATE_COLUMNS.includes(column) && value === 0) {
        return '';
    }
    if (isLongString(value)) {
        return value.substring(0, MAX_STRING_LENGTH) + '...';
    }
    return value;
}

// whiteSpace: 'normal', wordWrap: 'break-word',
export const getColumnStyles = (column) => {
    switch (column) {
        case 'status':
            return { textAlign: 'center', m: 0, p: 0 };
        default:
            return { textAlign: 'center', m: 0, p: 0 };
    }
};

export const getFilteredData = (containersList, filterHeaderData, statusAttributes, dcList, dockList, facilityList) => {
    const data = containersList.filter((row) => {
        let flag = true;
        for (let key in filterHeaderData) {
            // TODO: write logic of filtering date fields
            
            if (!filterHeaderData[key]) {
                continue;
            }

            if (!row[key]) {
                flag = false;
            }

            if (key === 'status') {
                if (row[key] && !statusAttributes[row[key]].description.toString().toLowerCase().startsWith(filterHeaderData[key].toString().toLowerCase())) {
                    flag = false;
                }
            } else if(key === 'facility_id' || key === 'location' || key === 'dock') {
                if (row[key] && !getEntityDesc(key, row[key], dcList, dockList, facilityList).toLowerCase().startsWith(filterHeaderData[key].toString().toLowerCase())) {
                    flag = false;
                }
            } else {
                if (row[key] && !row[key].toString().toLowerCase().startsWith(filterHeaderData[key].toString().toLowerCase())) {
                    flag = false;
                }
            }
        }
        if (flag) {
            return row;
        }
    });
    return data;
}

export const fieldValidation = (columnsData, displayName) => {
    for (const key in columnsData) {
        if (!columnsData[key]) {
            notify(AppConstants.ERROR, `${displayName[key]} is required`);
            return false;
        }
      }
    return true;
}


// Export to CSV file
export const getTableCellData = (column, value, statusAttributes) => {
    if (column === 'status' && value) {
        return statusAttributes[value].description
    }
    if (DATE_COLUMNS.includes(column) && value && value != '') {
        return getUAEDateTime(value)
    }
    return value || '';
}

export const downloadTableData = (screen, displayAttribute, displayName, statusAttributes, containersList) => {
    let data = []
    let temp = []
    temp = displayAttribute.map(e => {
      return displayName[e];
    })
    data.push(temp)
  
    containersList.forEach(row => {
      temp = displayAttribute.map(column => {
        return getTableCellData(column, row[column], statusAttributes);
      })
      data.push(temp);
    });
  
    const csvString = Papa.unparse(data);
  
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
  
    // Set the file name based on the selected item in the dropdown
    const fileName = `${ screen }_data.csv`;
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };