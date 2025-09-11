import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientListPage from './components/PatientListPage';
import PatientPage from './components/PatientPage';
import './App.css';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<PatientListPage />} />
          <Route path="/patients/:id" element={<PatientPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
