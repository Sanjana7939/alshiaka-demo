export const lovEntityTypes = [
    { name: 'TRANSPORTER' },
    { name: 'EMAIL' },
    { name: 'TRUCK' },
    { name: 'WH' },
    { name: 'DC' },
    { name: 'LOC' },
    { name: 'DOCK' },
    { name: 'POD VEHICLES' },
    { name: 'MALLS NAME' },
]

// Regular expression pattern for validating email addresses
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Function to check if a string is a valid email address
function isValidEmail(email) {
    return emailRegex.test(email);
}

export const testEmails = (entityDesc) => {
    // Split the string by commas and trim spaces
    const emails = entityDesc.split(',').map(email => email.trim());
    let valid = true;

    emails.forEach(email => {
        console.log(isValidEmail(email))
        if (!isValidEmail(email)) {
            valid = false;
        }
    });
    return valid;
}