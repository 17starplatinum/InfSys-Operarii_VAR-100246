import {OrganizationEnum} from "../../shared/constants";

export const organizationValidation = (field, value) => {
    let errorMsg = "";
    switch (field) {
        case "annualTurnover":
            if (!value || isNaN(value) || Number(value) <= 0) {
                errorMsg = "Годовой оборот должен быть положительным числом и не может быть null";
            }
            break;
        case "employeesCount":
            if (isNaN(value) || Number(value) <= 0) {
                errorMsg = "Число работников должно быть положительным числом";
            }
            break;
        case "fullName":
            if (value.trim() === "" || value.toString().length > 1576) {
                errorMsg = "Полное название не должно быть пустым и не должно превышать 1576 символов по длине";
            }
            break;
        case "type":
            if (!(value === null || value.trim() === "" || Object.values(OrganizationEnum).includes(value.trim()))) {
                errorMsg = "Тип организации должен быть из перечисленных значений";
            }
            break;
        default:
            break;
    }
    return errorMsg;
}