import { useState, useEffect } from 'react';
import { NonSensitivePatient } from '../types';
import { getAllPatients } from '../services/patientService';
import PatientList from './PatientList';

const PatientListPage = () => {
  const [patients, setPatients] = useState<NonSensitivePatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsData = await getAllPatients();
        setPatients(patientsData);
      } catch (err) {
        setError('Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Patientor</h1>
      <PatientList patients={patients} />
    </div>
  );
};

export default PatientListPage;