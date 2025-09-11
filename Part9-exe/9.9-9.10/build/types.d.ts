export interface Diagnosis {
    code: string;
    name: string;
    latin?: string;
}
export declare enum Gender {
    Male = "male",
    Female = "female",
    Other = "other"
}
export interface Patient {
    id: string;
    name: string;
    dateOfBirth: string;
    gender: Gender;
    occupation: string;
}
export interface PatientEntry extends Patient {
    ssn: string;
    entries: Array<unknown>;
}
export interface NewPatientEntry {
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string;
}
