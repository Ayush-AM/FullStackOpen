import { useState } from 'react';
import { NewEntry, HealthCheckRating, Diagnosis } from '../types';

interface EntryFormProps {
  onSubmit: (entry: NewEntry) => void;
  onCancel: () => void;
  diagnoses: Diagnosis[];
}

const EntryForm = ({ onSubmit, onCancel, diagnoses }: EntryFormProps) => {
  const [type, setType] = useState<'HealthCheck' | 'OccupationalHealthcare' | 'Hospital'>('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
    };

    let entry: NewEntry;

    switch (type) {
      case 'HealthCheck':
        entry = {
          ...baseEntry,
          type: 'HealthCheck',
          healthCheckRating,
        };
        break;
      case 'OccupationalHealthcare':
        entry = {
          ...baseEntry,
          type: 'OccupationalHealthcare',
          employerName,
          sickLeave: sickLeaveStart && sickLeaveEnd ? {
            startDate: sickLeaveStart,
            endDate: sickLeaveEnd,
          } : undefined,
        };
        break;
      case 'Hospital':
        entry = {
          ...baseEntry,
          type: 'Hospital',
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        };
        break;
      default:
        throw new Error('Invalid entry type');
    }

    onSubmit(entry);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
      <h3>Add New Entry</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type: </label>
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="HealthCheck">Health Check</option>
            <option value="OccupationalHealthcare">Occupational Healthcare</option>
            <option value="Hospital">Hospital</option>
          </select>
        </div>

        <div>
          <label>Description: </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Date: </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Specialist: </label>
          <input
            type="text"
            value={specialist}
            onChange={(e) => setSpecialist(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Diagnosis Codes: </label>
          <select
            multiple
            value={diagnosisCodes}
            onChange={(e) => setDiagnosisCodes(Array.from(e.target.selectedOptions, option => option.value))}
          >
            {diagnoses.map(diagnosis => (
              <option key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.code} - {diagnosis.name}
              </option>
            ))}
          </select>
        </div>

        {type === 'HealthCheck' && (
          <div>
            <label>Health Check Rating: </label>
            <select
              value={healthCheckRating}
              onChange={(e) => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}
            >
              <option value={0}>Healthy</option>
              <option value={1}>Low Risk</option>
              <option value={2}>High Risk</option>
              <option value={3}>Critical Risk</option>
            </select>
          </div>
        )}

        {type === 'OccupationalHealthcare' && (
          <>
            <div>
              <label>Employer Name: </label>
              <input
                type="text"
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Sick Leave Start: </label>
              <input
                type="date"
                value={sickLeaveStart}
                onChange={(e) => setSickLeaveStart(e.target.value)}
              />
            </div>
            <div>
              <label>Sick Leave End: </label>
              <input
                type="date"
                value={sickLeaveEnd}
                onChange={(e) => setSickLeaveEnd(e.target.value)}
              />
            </div>
          </>
        )}

        {type === 'Hospital' && (
          <>
            <div>
              <label>Discharge Date: </label>
              <input
                type="date"
                value={dischargeDate}
                onChange={(e) => setDischargeDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Discharge Criteria: </label>
              <input
                type="text"
                value={dischargeCriteria}
                onChange={(e) => setDischargeCriteria(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button type="submit">Add</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EntryForm;