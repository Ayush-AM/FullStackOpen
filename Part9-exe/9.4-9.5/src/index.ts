import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

const PORT = 3003;

// 9.4: Hello endpoint
app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

// 9.5: BMI endpoint
app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  
  if (!height || !weight) {
    return res.status(400).json({ error: 'missing parameters' });
  }
  
  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }
  
  try {
    const bmi = calculateBmi(Number(height), Number(weight));
    return res.json({
      weight: Number(weight),
      height: Number(height),
      bmi
    });
  } catch (error) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }
});

// Bonus: Exercise calculator endpoint
app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  
  if (!daily_exercises || !target) {
    return res.status(400).json({ error: 'parameters missing' });
  }
  
  if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }
  
  // Check if all elements in daily_exercises are numbers
  const allNumbers = daily_exercises.every((hour: unknown) => !isNaN(Number(hour)));
  if (!allNumbers) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }
  
  try {
    const result = calculateExercises(
      daily_exercises.map(Number), 
      Number(target)
    );
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});