export const coordinatesValidation = (field, value) => {
    let errorMsg = "";
    const x_limit = 990, y_limit = 12;
    if(isNaN(value) || value === "") {
        errorMsg = field.toUpperCase() + " не должен быть пустым";
        return errorMsg;
    }
    switch (field) {
        case "x":
            if (Number(value) > x_limit) {
                errorMsg = field.toUpperCase() + " не должен быть больше " + x_limit;
            }
            break;
        case "y":
            if (Number(value) > y_limit) {
                errorMsg = field.toUpperCase() + " не должен быть больше " + y_limit;
            }
            break;
        default:
            break;
    }
    return errorMsg;
}