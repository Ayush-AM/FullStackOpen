import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Patient, Diagnosis, NewEntry } from '../types';
import { getPatientById, getAllDiagnoses, addEntry } from '../services/patientService';
import PatientDetails from './PatientDetails';
import EntryDetails from './EntryDetails';
import EntryForm from './EntryForm';
import Notification from './Notification';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [patientData, diagnosesData] = await Promise.all([
          getPatientById(id),
          getAllDiagnoses()
        ]);
        setPatient(patientData);
        setDiagnoses(diagnosesData);
        setError(null);
      } catch (err) {
        setError('Patient not found');
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddEntry = async (entry: NewEntry) => {
    if (!patient) return;

    try {
      const newEntry = await addEntry(patient.id, entry);
      setPatient({
        ...patient,
        entries: [...patient.entries, newEntry]
      });
      setShowForm(false);
      setNotification({ message: 'Entry added successfully!', type: 'success' });
    } catch (error: unknown) {
      let errorMessage = 'Failed to add entry';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setNotification({ message: errorMessage, type: 'error' });
    }
  };

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
      
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      
      <PatientDetails patient={patient} />
      
      <h3>Entries</h3>
      {patient.entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        patient.entries.map(entry => (
          <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))
      )}
      
      {showForm ? (
        <EntryForm
          onSubmit={handleAddEntry}
          onCancel={() => setShowForm(false)}
          diagnoses={diagnoses}
        />
      ) : (
        <button onClick={() => setShowForm(true)}>Add New Entry</button>
      )}
    </div>
  );
};

export default PatientPage;