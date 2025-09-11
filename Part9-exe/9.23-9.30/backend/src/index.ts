import express from 'express';
import cors from 'cors';
import { Patient, Entry } from './types';
import patientService from './services/patientService';
import diagnosisService from './services/diagnosisService';
import { toNewEntry } from './utils';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

// Get all patients (non-sensitive)
app.get('/api/patients', (_req, res) => {
  res.send(patientService.getNonSensitivePatients());
});

// Get patient by id
app.get('/api/patients/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

// Get all diagnoses
app.get('/api/diagnoses', (_req, res) => {
  res.send(diagnosisService.getDiagnoses());
});

// Add new patient
app.post('/api/patients', (req, res) => {
  try {
    const newPatient = patientService.addPatient(req.body);
    res.json(newPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

// 9.27: Add entry endpoint
app.post('/api/patients/:id/entries', (req, res) => {
  try {
    const patient = patientService.findById(req.params.id);
    if (!patient) {
      return res.status(404).send('Patient not found');
    }

    const newEntry = toNewEntry(req.body);
    const addedEntry = patientService.addEntry(patient, newEntry);
    
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});