export const isNotNumber = (argument: any): boolean => {
  return isNaN(Number(argument));
};

export const parseArguments = (args: string[]): number[] => {
  if (args.length < 2) throw new Error('Not enough arguments');
  
  const numbers = args.slice(2).map(arg => {
    if (isNotNumber(arg)) {
      throw new Error('Provided values were not numbers!');
    }
    return Number(arg);
  });
  
  return numbers;
};

export default { isNotNumber, parseArguments };