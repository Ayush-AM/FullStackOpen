import { parseArguments } from './utils';

interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (dailyHours: number[], target: number): ExerciseResult => {
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
  let rating: number;
  let ratingDescription: string;
  
  if (average >= target) {
    rating = 3;
    ratingDescription = 'excellent, target achieved';
  } else if (average >= target * 0.8) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
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

// Check if we're running from command line with arguments
if (process.argv.length > 2) {
  try {
    const args = parseArguments(process.argv);
    if (args.length < 2) {
      throw new Error('Please provide at least two arguments: target followed by daily hours');
    }
    
    const target = args[0];
    const dailyHours = args.slice(1);
    const result = calculateExercises(dailyHours, target);
    console.log(result);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
} else {
  // If no command line arguments, run the hard-coded test
  console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
}