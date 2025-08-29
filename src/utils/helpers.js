export const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};

export const calculateBMI = (weight, height) => {
    if (height <= 0) return 0;
    return (weight / (height * height)).toFixed(2);
};

export const calculateProgressPercentage = (current, goal) => {
    if (goal <= 0) return 0;
    return ((current / goal) * 100).toFixed(2);
};

export const generateRandomId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
};