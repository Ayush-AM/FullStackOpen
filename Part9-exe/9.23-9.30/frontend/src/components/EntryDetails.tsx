import { Entry, Diagnosis } from '../types';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

interface EntryDetailsProps {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry, diagnoses }: EntryDetailsProps) => {
  const getDiagnosisName = (code: string): string => {
    const diagnosis = diagnoses.find(d => d.code === code);
    return diagnosis ? `${diagnosis.code} ${diagnosis.name}` : code;
  };

  switch (entry.type) {
    case "Hospital":
      return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <p>{entry.date} <LocalHospitalIcon /></p>
          <p><i>{entry.description}</i></p>
          <p>Discharge: {entry.discharge.date} - {entry.discharge.criteria}</p>
          {entry.diagnosisCodes && (
            <ul>
              {entry.diagnosisCodes.map(code => (
                <li key={code}>{getDiagnosisName(code)}</li>
              ))}
            </ul>
          )}
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <p>{entry.date} <WorkIcon /> {entry.employerName}</p>
          <p><i>{entry.description}</i></p>
          {entry.sickLeave && (
            <p>Sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</p>
          )}
          {entry.diagnosisCodes && (
            <ul>
              {entry.diagnosisCodes.map(code => (
                <li key={code}>{getDiagnosisName(code)}</li>
              ))}
            </ul>
          )}
        </div>
      );
    case "HealthCheck":
      return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <p>{entry.date} <MonitorHeartIcon /></p>
          <p><i>{entry.description}</i></p>
          <p>Health check rating: {entry.healthCheckRating}</p>
          {entry.diagnosisCodes && (
            <ul>
              {entry.diagnosisCodes.map(code => (
                <li key={code}>{getDiagnosisName(code)}</li>
              ))}
            </ul>
          )}
        </div>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;