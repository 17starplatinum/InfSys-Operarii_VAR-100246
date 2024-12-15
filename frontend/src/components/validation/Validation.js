export const validateFields = (v, value, schema, option = false) => {
    if(option === true) {
        return v.validate(value, schema, {nestedErrors: option}).errors;
    }
    return v.validate(value, schema);
};
