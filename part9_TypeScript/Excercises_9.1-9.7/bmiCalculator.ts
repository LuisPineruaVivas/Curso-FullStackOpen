interface BMIValues {
    value1: number,
    value2: number
}


export function calculateBmi (height: number, weight: number): string {
    const bmi = weight / (height / 100) ** 2;
    if (bmi < 18.5) {
         return ('Underweight');
    } else if (bmi < 25) {
        return('Normal Range');
    } else {
        return('Overweight');
    }
};


const parseArguments = (args: string[]): BMIValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

try {
  const { value1, value2 } = parseArguments(process.argv);
  const bmi = calculateBmi(value1, value2);
  console.log(bmi);
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}