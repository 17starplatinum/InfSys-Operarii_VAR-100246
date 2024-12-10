import {PositionEnum, StatusEnum} from "../../shared/constants";

export const workerValidation = (field, value) => {
    let errorMsg = "";
    switch (field) {
        case "name":
            if (!value || value.trim() === "") {
                errorMsg = "Имя не должна быть пустой";
            }
            break;
        case "salary":
            if (isNaN(value) || value <= 0) {
                errorMsg = "Зарплата должна быть положительным числом";
            }
            break;
        case "rating":
            if (isNaN(value) || value <= 0) {
                errorMsg = "Рейтинг должен быть положительным числом";
            }
            break;
        case "position":
            if (!value || value.trim() === "" || !Object.values(PositionEnum).includes(value.trim())) {
                errorMsg = "Позиция не должна быть пустым и должна быть из перечисленных значений";
            }
            break;
        case "status":
            if (!(value === null || value.trim() === "" || Object.values(StatusEnum).includes(value.trim()))) {
                errorMsg = "Статус должна быть из перечисленных значений";
            }
            break;
        default:
            break;
    }
    return errorMsg;
}