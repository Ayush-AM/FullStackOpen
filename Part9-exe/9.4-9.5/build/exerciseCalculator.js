"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateExercises = void 0;
const utils_1 = require("./utils");
const calculateExercises = (dailyHours, target) => {
    if (dailyHours.length === 0) {
        throw new Error('Daily hours array cannot be empty');
    }
    if (target <= 0) {
        throw new Error('Target must be a positive number');
    }
    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.filter(hours => hours > 0).length;
    const average = dailyHours.reduce((sum, hours) => sum + hours, 0) / periodLength;
    const success = average >= target;
    // Calculate rating
    let rating;
    let ratingDescription;
    if (average >= target) {
        rating = 3;
        ratingDescription = 'excellent, target achieved';
    }
    else if (average >= target * 0.8) {
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    }
    else {
        rating = 1;
        ratingDescription = 'needs more effort';
    }
    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};
exports.calculateExercises = calculateExercises;
// Only run if this module is the main module (not imported)
if (require.main === module) {
    try {
        const args = (0, utils_1.parseArguments)(process.argv);
        if (args.length < 2) {
            throw new Error('Please provide at least two arguments: target followed by daily hours');
        }
        const target = args[0];
        const dailyHours = args.slice(1);
        const result = (0, exports.calculateExercises)(dailyHours, target);
        console.log(result);
    }
    catch (error) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        console.log(errorMessage);
    }
}
