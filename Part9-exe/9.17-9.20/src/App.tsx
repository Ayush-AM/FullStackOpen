import { useState, useEffect } from 'react';
import type { DiaryEntry, NewDiaryEntry } from './types';
import { getAllDiaries, createDiaryEntry } from './services/diaryService';
import DiaryList from './components/DiaryList';
import DiaryForm from './components/DiaryForm';
import Notification from './components/Notification';

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const diaries = await getAllDiaries();
      setDiaries(diaries);
    } catch (error) {
      showNotification('Failed to fetch diaries', 'error');
    }
  };

  const showNotification = (message: string, type: 'error' | 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const addDiaryEntry = async (entry: NewDiaryEntry) => {
    try {
      const newDiary = await createDiaryEntry(entry);
      setDiaries([...diaries, newDiary]);
      showNotification('Diary entry added successfully!', 'success');
    } catch (error: unknown) {
      if (error instanceof Error) {
        showNotification(`Error: ${error.message}`, 'error');
      } else {
        showNotification('Unknown error occurred', 'error');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Flight Diaries</h1>
      
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      
      <DiaryForm onSubmit={addDiaryEntry} error={notification?.type === 'error' ? notification.message : null} />
      <DiaryList diaries={diaries} />
    </div>
  );
}

export default App;