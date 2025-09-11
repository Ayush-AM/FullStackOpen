import axios from 'axios';
import { Patient, NonSensitivePatient, Diagnosis, NewEntry, Entry } from '../types';

const baseUrl = 'http://localhost:3001/api';

export const getAllPatients = async (): Promise<NonSensitivePatient[]> => {
  const response = await axios.get<NonSensitivePatient[]>(`${baseUrl}/patients`);
  return response.data;
};

export const getPatientById = async (id: string): Promise<Patient> => {
  const response = await axios.get<Patient>(`${baseUrl}/patients/${id}`);
  return response.data;
};

export const getAllDiagnoses = async (): Promise<Diagnosis[]> => {
  const response = await axios.get<Diagnosis[]>(`${baseUrl}/diagnoses`);
  return response.data;
};

export const addEntry = async (patientId: string, entry: NewEntry): Promise<Entry> => {
  const response = await axios.post<Entry>(`${baseUrl}/patients/${patientId}/entries`, entry);
  return response.data;
};