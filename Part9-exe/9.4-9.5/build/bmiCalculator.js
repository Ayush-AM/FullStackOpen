"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBmi = void 0;
const utils_1 = require("./utils");
const calculateBmi = (height, weight) => {
    if (height <= 0 || weight <= 0) {
        throw new Error('Height and weight must be positive numbers');
    }
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    if (bmi < 18.5) {
        return 'Underweight';
    }
    else if (bmi < 25) {
        return 'Normal range';
    }
    else if (bmi < 30) {
        return 'Overweight';
    }
    else {
        return 'Obese';
    }
};
exports.calculateBmi = calculateBmi;
// Only run if this module is the main module (not imported)
if (require.main === module) {
    try {
        const args = (0, utils_1.parseArguments)(process.argv);
        if (args.length !== 2) {
            throw new Error('Please provide exactly two arguments: height and weight');
        }
        const [height, weight] = args;
        console.log((0, exports.calculateBmi)(height, weight));
    }
    catch (error) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        console.log(errorMessage);
    }
}
