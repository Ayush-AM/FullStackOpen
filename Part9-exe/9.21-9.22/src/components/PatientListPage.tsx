import { useState, useEffect } from 'react';
import { NonSensitivePatient } from '../types';
import { getAllPatients } from '../services/patientService';
import PatientList from './PatientList';

const PatientListPage = () => {
  const [patients, setPatients] = useState<NonSensitivePatient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsData = await getAllPatients();
        setPatients(patientsData);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div>
      <h1>Patientor</h1>
      <PatientList patients={patients} />
    </div>
  );
};

export default PatientListPage;