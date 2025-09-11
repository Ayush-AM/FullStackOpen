import { NewEntry, HealthCheckRating } from './types';

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('type' in object) {
    switch (object.type) {
      case 'HealthCheck':
        return parseHealthCheckEntry(object);
      case 'OccupationalHealthcare':
        return parseOccupationalHealthcareEntry(object);
      case 'Hospital':
        return parseHospitalEntry(object);
      default:
        throw new Error('Invalid entry type');
    }
  }

  throw new Error('Missing type field');
};

const parseHealthCheckEntry = (object: any): NewEntry => {
  return {
    type: 'HealthCheck',
    description: parseString(object.description, 'description'),
    date: parseString(object.date, 'date'),
    specialist: parseString(object.specialist, 'specialist'),
    diagnosisCodes: parseDiagnosisCodes(object),
    healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
  };
};

const parseOccupationalHealthcareEntry = (object: any): NewEntry => {
  return {
    type: 'OccupationalHealthcare',
    description: parseString(object.description, 'description'),
    date: parseString(object.date, 'date'),
    specialist: parseString(object.specialist, 'specialist'),
    diagnosisCodes: parseDiagnosisCodes(object),
    employerName: parseString(object.employerName, 'employerName'),
    sickLeave: object.sickLeave ? parseSickLeave(object.sickLeave) : undefined
  };
};

const parseHospitalEntry = (object: any): NewEntry => {
  return {
    type: 'Hospital',
    description: parseString(object.description, 'description'),
    date: parseString(object.date, 'date'),
    specialist: parseString(object.specialist, 'specialist'),
    diagnosisCodes: parseDiagnosisCodes(object),
    discharge: parseDischarge(object.discharge)
  };
};

const parseString = (value: unknown, fieldName: string): string => {
  if (!value || !isString(value)) {
    throw new Error(`Incorrect or missing ${fieldName}`);
  }
  return value;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseDiagnosisCodes = (object: any): Array<string> => {
  if (!object.diagnosisCodes || !Array.isArray(object.diagnosisCodes)) {
    return [];
  }
  return object.diagnosisCodes;
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!isNumber(rating) || rating < 0 || rating > 3) {
    throw new Error('Incorrect or missing health check rating');
  }
  return rating as HealthCheckRating;
};

const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' || value instanceof Number;
};

const parseSickLeave = (sickLeave: any): { startDate: string; endDate: string } => {
  return {
    startDate: parseString(sickLeave.startDate, 'sickLeave.startDate'),
    endDate: parseString(sickLeave.endDate, 'sickLeave.endDate')
  };
};

const parseDischarge = (discharge: any): { date: string; criteria: string } => {
  return {
    date: parseString(discharge.date, 'discharge.date'),
    criteria: parseString(discharge.criteria, 'discharge.criteria')
  };
};