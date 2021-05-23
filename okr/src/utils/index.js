export const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
        );
        return result;
    }, {}); // empty object is the initial value for result object
};