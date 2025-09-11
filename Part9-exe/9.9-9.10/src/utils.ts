import { NewPatientEntry, Gender } from './types';

// 9.13: Type guard to check if string is a valid gender
const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

// 9.13: Parse gender from unknown type
const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

// Helper function to check if a value is string
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

// Helper function to parse string from unknown type
const parseString = (param: unknown, paramName: string): string => {
  if (!param || !isString(param)) {
    throw new Error(`Incorrect or missing ${paramName}: ${param}`);
  }
  return param;
};

// 9.13: Function to validate and parse new patient data
export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    const newEntry: NewPatientEntry = {
      name: parseString(object.name, 'name'),
      dateOfBirth: parseString(object.dateOfBirth, 'dateOfBirth'),
      ssn: parseString(object.ssn, 'ssn'),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation, 'occupation')
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};