import { Weather, Visibility } from './types';
import z from 'zod';

export const newEntrySchema = z.object({
  weather: z.nativeEnum(Weather,
    {
      error: 'Weather must be one of the following: sunny, rainy, cloudy, windy, stormy'
    }
  ),
  visibility: z.nativeEnum(Visibility, {
    error: 'Visibility must be one of the following: great, good, ok, poor'
  }),
  date: z.string().date(),
  comment: z.string().optional()
});