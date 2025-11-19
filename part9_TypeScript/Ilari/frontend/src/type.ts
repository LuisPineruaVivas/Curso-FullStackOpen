export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy'

export type Visibility = 'great' | 'good' | 'ok' | 'poor'

export interface diarientry {
    id: number;
    date: string;
    weather: Weather;
    visibility: Visibility;
    comment?: string;
}

export type sensitiveDiaryEntry = Omit<diarientry, 'comment'>

export type newDiaryEntry = Omit<diarientry, 'id'>

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>
}

type errorType = {
  code: string;
  message: string;
  path: string[];
};

export type PostEntryErrorType = {
  status: string;
  message: string;
  type: string;
  error: errorType[];
};
