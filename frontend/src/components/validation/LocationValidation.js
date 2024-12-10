export const locationValidation = (field, value) => {
    let errorMsg = "";
    if (!value || isNaN(value)) {
        errorMsg = field.toUpperCase();
    }
    return errorMsg;
}