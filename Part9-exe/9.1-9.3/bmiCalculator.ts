import { parseArguments, isNotNumber } from './utils';

export const calculateBmi = (height: number, weight: number): string => {
  if (height <= 0 || weight <= 0) {
    throw new Error('Height and weight must be positive numbers');
  }
  
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi < 25) {
    return 'Normal range';
  } else if (bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
};

// Check if we're running from command line with arguments
if (process.argv.length > 2) {
  try {
    const args = parseArguments(process.argv);
    if (args.length !== 2) {
      throw new Error('Please provide exactly two arguments: height and weight');
    }
    
    const [height, weight] = args;
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
} else {
  // If no command line arguments, run the hard-coded test
  console.log(calculateBmi(180, 74)); // Should print "Normal range"
}