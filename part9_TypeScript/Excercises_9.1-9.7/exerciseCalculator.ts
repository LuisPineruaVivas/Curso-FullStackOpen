interface Result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

const parseExcercises = (args: string[]) => {
    const exercises: number[] = [];
    let target = 0;
    for (let i = 2; i < args.length; i++) {
        if (!isNaN(Number(args[i])) && i === 2) {
            target = Number(args[i]);            
        } else if (!isNaN(Number(args[i])) && i > 2) {
            exercises.push(Number(args[i]));
        } else {
            throw new Error('Provided values were not numbers!');
        }
    }
    return {
        target,
        exercises
    };
};

export const calculateExercises = (exercises: number[], target: number): Result => {
    const periodLength = exercises.length;
    const trainingDays = exercises.filter(e => e > 0).length;
    const average = exercises.reduce((a, b) => a + b, 0) / periodLength;
    const success = average >= target;
    let rating = 1;
    let ratingDescription = 'bad';
    if (average > target + 0.25) {
        rating = 3;
        ratingDescription = 'good job';
    } else if (average >= target - 0.25 && average <= target + 0.25) {
        rating = 2;
        ratingDescription = 'Doing good keep it up';
    }
    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};

try {
  const { target, exercises } = parseExcercises(process.argv);
  console.log(calculateExercises(exercises, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}