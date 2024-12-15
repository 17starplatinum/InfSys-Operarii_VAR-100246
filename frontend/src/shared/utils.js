export const getAxios = () => JSON.parse(localStorage.getItem("axios"));

export const removeKey = (obj, key) => obj !== Object(obj)
    ? obj
    : Array.isArray(obj)
        ? obj.map(item => removeKey(item, key))
        : Object.keys(obj)
            .filter(k => k !== key)
            .reduce((acc, x) => Object.assign(acc, { [x]: removeKey(obj[x], key) }), {});
