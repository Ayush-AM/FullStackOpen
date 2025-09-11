import { useState } from 'react';
import type { NewDiaryEntry } from '../types';
import { Weather, Visibility } from '../types';

interface DiaryFormProps {
  onSubmit: (entry: NewDiaryEntry) => void;
  error: string | null;
}

const DiaryForm = ({ onSubmit, error }: DiaryFormProps) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment: comment || undefined,
    };

    onSubmit(newEntry);
    
    // Reset form
    setDate('');
    setWeather(Weather.Sunny);
    setVisibility(Visibility.Great);
    setComment('');
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date: </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Weather: </label>
          {Object.values(Weather).map(w => (
            <label key={w} style={{ marginRight: '10px' }}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={weather === w}
                onChange={() => setWeather(w as Weather)}
              />
              {w}
            </label>
          ))}
        </div>
        
        <div>
          <label>Visibility: </label>
          {Object.values(Visibility).map(v => (
            <label key={v} style={{ marginRight: '10px' }}>
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={visibility === v}
                onChange={() => setVisibility(v as Visibility)}
              />
              {v}
            </label>
          ))}
        </div>
        
        <div>
          <label htmlFor="comment">Comment: </label>
          <input
            id="comment"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default DiaryForm;