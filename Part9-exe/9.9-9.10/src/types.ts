// 9.10: Diagnosis type
export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

// 9.13: Gender enum
export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

// 9.11: Patient type (without ssn for public view)
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: Gender;
  occupation: string;
}

// Internal patient type with all fields (for data storage)
export interface PatientEntry extends Patient {
  ssn: string;
  entries: Array<unknown>;
}

// 9.13: Type for new patient data (without id)
export interface NewPatientEntry {
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
}