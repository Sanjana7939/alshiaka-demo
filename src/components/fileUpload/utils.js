import Papa from 'papaparse';
import { AppConstants } from '../../config/app-config';
import dayjs from 'dayjs';
import { notify } from '../../utils';

function isValidDdmmyyFormat(inputDate, columnName) {
    // server will decide if field is required
    if (!inputDate) {
        return { valid: true };
    }

    // checking dd/mm/YYYY format
    if (inputDate.includes('/')) {
        const dateArray = inputDate.split('/');

        if (dateArray.length !== 3) {
            return { valid: false, error: `DateColumn: "${columnName}" is invalid. Required format is dd/mm/YYYY` };
        }

        // Extract day, month, and year from the string
        const day = parseInt(dateArray[0], 10);
        const month = parseInt(dateArray[1], 10);
        const year = parseInt(dateArray[2], 10);

        // Check if the year is in a reasonable range (adjust as needed)
        if (year < 1000 || year > 9999) {
            return { valid: false, error: `[DateColumn: "${columnName}", Value: "${inputDate}"], year is invalid.` };
        }

        // Check if the month is valid (1 to 12)
        if (month < 1 || month > 12) {
            return { valid: false, error: `[DateColumn: "${columnName}", Value: "${inputDate}"], month is invalid.` };
        }

        // Check if the day is valid for the given month
        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
            return { valid: false, error: `[DateColumn: "${columnName}", Value: "${inputDate}"], day is invalid.` };
        }

        // If all checks pass, the date is considered valid
        return { valid: true };
    }

    // checking ddmmYY format
    else {
        // Check if the string has exactly 6 digits
        if (!/^\d{6}$/.test(inputDate)) {
            return { valid: false, error: `[DateColumn: "${columnName}", Value: "${inputDate}"], is invalid.` };
        }

        // Extract day, month, and year from the string
        const day = parseInt(inputDate.substring(0, 2), 10);
        const month = parseInt(inputDate.substring(2, 4), 10);
        const year = parseInt(inputDate.substring(4, 6), 10);

        // Check if the year is in a reasonable range (adjust as needed)
        if (year < 0 || year > 99) {
            return { valid: false, error: `[DateColumn: "${columnName}", Value: "${inputDate}"], year is invalid.` };
        }

        // Check if the month is valid (1 to 12)
        if (month < 1 || month > 12) {
            return { valid: false, error: `[DateColumn: "${columnName}", Value: "${inputDate}"], month is invalid.` };
        }

        // Check if the day is valid for the given month
        const daysInMonth = new Date(year + 2000, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
            return { valid: false, error: `[DateColumn: "${columnName}", Value: "${inputDate}"], day is invalid.` };
        }

        // If all checks pass, the date is considered valid
        return { valid: true };
    }
}

function convertDdmmyyToTimestamp(inputDate) {
    // server will decide if field is required
    if (!inputDate) {
        return '';
    }

    // converting dd/mm/YYYY format
    if (inputDate.includes('/')) {
        const dateArray = inputDate.split('/');

        // Extract day, month, and year from the string
        const day = parseInt(dateArray[0], 10);
        const month = parseInt(dateArray[1], 10);
        const year = parseInt(dateArray[2], 10);

        const date = `${year}-${month}-${day}`

        // on passing a second parameter as true, only the timezone (and offset) is updated, keeping local time same
        const dateObject = dayjs(date).tz(AppConstants.TIMEZONE, true)

        console.log(dateObject.utc().valueOf())
        return dateObject.utc().valueOf();
    }

    // converting ddmmYY format
    else {
        const day = inputDate.substring(0, 2)
        const month = inputDate.substring(2, 4)
        const year = "20"+ inputDate.substring(4)

        const date = `${year}-${month}-${day}`

        // on passing a second parameter as true, only the timezone (and offset) is updated, keeping local time same
        const dateObject = dayjs(date).tz(AppConstants.TIMEZONE, true)

        console.log(dateObject.utc().valueOf())
        return dateObject.utc().valueOf();
    }
}

export const parseCsvRows = (selectedFile, fileTypeData) => {
    const headerDetails = fileTypeData.headerDetails;
    return new Promise((resolve, reject) => {
        let mappedRows = [];

        Papa.parse(selectedFile, {
            error: (e) => {
                reject(`Error! CSV can't be Parsed ${e.toString()}`);
            },
            complete: (result) => {
                mappedRows = result.data
                    .filter(row => !Object.values(row).every(value => value === '' || value === null)) // Filter out rows where every field is empty
                    .map((val) => {
                    const trimmedFields = result.meta.fields.map((e) => e.toLowerCase().trim());
                    let row = {};
                    trimmedFields.forEach((header, index) => {
                        if (!headerDetails[header]) {
                            reject(`Error parsing header "${header}"`);
                        }

                        let value = val[result.meta.fields[index]].trim();

                        if (/^[0-9.+-]+[eE]/.test(value)) {
                            // Check if the value is in scientific notation format
                            // reject(`Scientific Notation used for field ${header}`);
                            
                            value = parseFloat(value).toString();
                            // notify(AppConstants.WARNING, `Scientific Notation used for field ${header}`)
                        }

                        row[headerDetails[header].name] = value;

                        // parse date (DD/MM/YYYY) to timestamp
                        if (headerDetails[header].type === 'date') {
                            const validation = isValidDdmmyyFormat(value, header);
                            if (!validation.valid) {
                                reject(validation.error);
                            }
                            let timestamp = convertDdmmyyToTimestamp(value);
                            if (isNaN(timestamp)) {
                                reject(`"${header}" is not valid date`);
                            }
                            row[headerDetails[header].name] = timestamp;
                        }
                    });
                    return row;
                });
                resolve(mappedRows);
            },
            header: true, // If the first row contains headers
            skipEmptyLines: true,
        });
    });
};


// Helper function to parse CSV headers
export const parseCsvHeaders = (csvContent) => {
    const lines = csvContent.split("\n");
    const headers = lines[0].split(",").map((header) => header.trim()); // Trim each header
    return headers;
};

export const compareHeaders = (headers1, headers2, pageState) => {
    const normalizedHeaders1 = headers1.map((header) => header.toLowerCase());
    const normalizedHeaders2 = headers2.map((header) => header.toLowerCase());
    console.log("compareHeaders pageState", pageState);
    const sortedHeaders1 = normalizedHeaders1.slice().sort();
    const sortedHeaders2 = normalizedHeaders2.slice().sort();

    console.log(sortedHeaders2);
    const selectedFileType = pageState.dropdownOptions[pageState.selectedIndex];

    const match =
        sortedHeaders1.length === sortedHeaders2.length &&
        sortedHeaders1.every(
            (header, index) => header.toLowerCase() === sortedHeaders2[index]
        );

    if (!match) {
        console.error("Headers do not match for other file types:");
    }

    return match;
};

// Helper function to read file content as text
export const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};
