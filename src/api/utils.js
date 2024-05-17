export const processError = (error, defaultErrorMessage) => {
    if(error.response && error.response.status == 401) {
        throw error.response.data.message || 'Unauthorized!'
    }
    if (error.response && error.response.data.error_message) {
        throw error.response.data.error_message
    }
    if (error.response && error.response.data.message) {
        throw error.response.data.message
    }
    if (error.message) {
        throw error.message
    }
    throw defaultErrorMessage;
}