"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArguments = exports.isNotNumber = void 0;
const isNotNumber = (argument) => {
    return isNaN(Number(argument));
};
exports.isNotNumber = isNotNumber;
const parseArguments = (args) => {
    if (args.length < 2)
        throw new Error('Not enough arguments');
    const numbers = args.slice(2).map(arg => {
        if ((0, exports.isNotNumber)(arg)) {
            throw new Error('Provided values were not numbers!');
        }
        return Number(arg);
    });
    return numbers;
};
exports.parseArguments = parseArguments;
exports.default = { isNotNumber: exports.isNotNumber, parseArguments: exports.parseArguments };
