import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.send({ error: 'malformatted parameters' });
    return;
  }
  const bmi = calculateBmi(height, weight);
  res.send({ weight, height, bmi });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).send({ error: 'parameters missing' });
  }

  if(!Array.isArray(daily_exercises) || daily_exercises.length === 0 || isNaN(Number(target))) {
    for (let i = 0; i < daily_exercises.length; i++) {
      if (isNaN(Number(daily_exercises[i]))) {
        return res.status(400).send({ error: 'malformatted parameters' });
      }
    }
    return res.status(400).send({ error: 'malformatted parameters' });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return res.send(calculateExercises(daily_exercises, target));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    return res.status(400).send({ error: errorMessage });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});