export const addressValidation = (field, value) => {
    let errorMsg = "";
    if (!value || value.trim() === "") {
        errorMsg = "Почтовый индекс не должен быть пустым";
    }
    return errorMsg;
}