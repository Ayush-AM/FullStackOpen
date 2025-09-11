import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Patient } from '../types';
import { getPatientById } from '../services/patientService';
import PatientDetails from './PatientDetails';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const patientData = await getPatientById(id);
        setPatient(patientData);
        setError(null);
      } catch (err) {
        setError('Patient not found');
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !patient) {
    return (
      <div>
        <p>{error}</p>
        <Link to="/">Back to patients list</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/">Back to patients list</Link>
      <PatientDetails patient={patient} />
    </div>
  );
};

export default PatientPage;