import { Link } from 'react-router-dom';
import { NonSensitivePatient } from '../types';

interface PatientListProps {
  patients: NonSensitivePatient[];
}

const PatientList = ({ patients }: PatientListProps) => {
  return (
    <div>
      <h2>Patients</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Gender</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Occupation</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <Link to={`/patients/${patient.id}`}>{patient.name}</Link>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patient.gender}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patient.occupation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;