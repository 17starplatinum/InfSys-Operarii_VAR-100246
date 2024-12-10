import {ColorEnum, CountryEnum} from "../../shared/constants";

export const personValidation = (field, value) => {
    let errorMsg = "";
    switch (field) {
        case "eyeColor":
            if (!value || value.trim() === "" || !Object.values(ColorEnum).includes(value.trim())) {
                errorMsg = "Цвет глаз не должен быть пустым и должен быть из перечисленных значений";
            }
            break;
        case "hairColor":
            if (!(value === null || value.trim() === "" || Object.values(ColorEnum).includes(value.trim()))) {
                errorMsg = "Цвет волос должен быть из перечисленных значений";
            }
            break;
        case "birthday":
            if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value)) {
                errorMsg = "День рождения должен быть валидной датой";
            }
            break;
        case "weight":
            if (!value || isNaN(value) || Number(value) <= 0) {
                errorMsg = "Вес человека должен быть положительным ненулевым числом";
            }
            break;
        case "nationality":
            if (!value || value.trim() === "" || !Object.values(CountryEnum).includes(value.trim())) {
                errorMsg = "Национальность не должна быть пустым и должна быть из перечисленных значений";
            }
            break;
        default:
            break;
    }
    return errorMsg;
}