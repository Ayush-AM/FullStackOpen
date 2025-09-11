import { Patient } from '../types';
import GenderIcon from './GenderIcon';

interface PatientDetailsProps {
  patient: Patient;
}

const PatientDetails = ({ patient }: PatientDetailsProps) => {
  return (
    <div>
      <h2>
        {patient.name} <GenderIcon gender={patient.gender} />
      </h2>
      <p>SSN: {patient.ssn}</p>
      <p>Occupation: {patient.occupation}</p>
      <p>Date of Birth: {patient.dateOfBirth}</p>
      
      <h3>Entries</h3>
      {patient.entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <ul>
          {patient.entries.map((entry, index) => (
            <li key={index}>
              {/* Entry details will be added in later exercises */}
              Entry #{index + 1}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientDetails;