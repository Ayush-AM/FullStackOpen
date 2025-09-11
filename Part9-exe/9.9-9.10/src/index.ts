import express from 'express';
import cors from 'cors';
import { v1 as uuid } from 'uuid';
import { Diagnosis, Patient, PatientEntry } from './types';
import diagnosesData from './data/diagnoses';
import patientsData from './data/patients';
import { toNewPatientEntry } from './utils';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

// 9.8: Ping endpoint
app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

// 9.10: Get all diagnoses
app.get('/api/diagnoses', (_req, res) => {
  const diagnoses: Diagnosis[] = diagnosesData;
  res.json(diagnoses);
});

// 9.11: Get all patients (excluding ssn)
app.get('/api/patients', (_req, res) => {
  const patients: Patient[] = patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender: gender as import('./types').Gender,
    occupation
  }));
  res.json(patients);
});

// 9.12: POST endpoint for adding new patients
app.post('/api/patients', (req, res) => {
  try {
    // 9.13: Validate and parse the request body
    const newPatientEntry = toNewPatientEntry(req.body);
    
    // 9.12: Create new patient with unique ID
    const newPatient: PatientEntry = {
      id: uuid(),
      ...newPatientEntry,
      entries: []
    };

    // Add to in-memory data store
    patientsData.push(newPatient);
    
    // Return the patient without SSN (for frontend)
    const { id, name, dateOfBirth, gender, occupation } = newPatient;
    const responsePatient: Patient = {
      id,
      name,
      dateOfBirth,
      gender,
      occupation
    };
    
    res.json(responsePatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});