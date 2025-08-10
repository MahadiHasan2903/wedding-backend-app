"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAge = exports.isStringArray = exports.sanitizeError = void 0;
const sanitizeError = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    try {
        return JSON.stringify(error);
    }
    catch {
        return 'Unknown error';
    }
};
exports.sanitizeError = sanitizeError;
const isStringArray = (value) => {
    return (Array.isArray(value) && value.every((item) => typeof item === 'string'));
};
exports.isStringArray = isStringArray;
const calculateAge = (dateOfBirth) => {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    const dayDiff = today.getDate() - dateOfBirth.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    return age;
};
exports.calculateAge = calculateAge;
//# sourceMappingURL=helpers.js.map