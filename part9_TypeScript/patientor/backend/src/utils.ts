import { Gender, HealthCheckRating, EntryWithoutId, EntryType, Diagnosis } from './types';
import z from 'zod';

export const newPacientSchema = z.object({
  name: z.string().min(3),
  dateOfBirth: z.string().refine(s => !Number.isNaN(Date.parse(s)), { message: 'Invalid date' }),
  ssn: z.string().min(5),
  gender: z.nativeEnum(Gender),
  occupation: z.string().optional(),
  entries: z.array(z.any()).optional()
});

const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (!('type' in object)) {
    throw new Error('Incorrect data: missing type');
  }

  if ('description' in object && 'date' in object && 'specialist' in object) {
    const baseEntry = {
      description: parseDescription(object.description),
      date: parseDate(object.date),
      specialist: parseSpecialist(object.specialist),
      diagnosisCodes: 'diagnosisCodes' in object ? parseDiagnosisCodes(object.diagnosisCodes) : undefined,
    };

    const entryType = parseType(object.type);

    switch (entryType) {

      case EntryType.HealthCheck: {
        if('healthCheckRating' in object) {
          const healthCheckRating = parseHealthCheckRating(object.healthCheckRating);
          const newEntry: EntryWithoutId = {
            ...baseEntry,
            type: EntryType.HealthCheck,
            healthCheckRating
          };
          return newEntry;
        }
        throw new Error('Incorrect data: missing healthCheckRating');
      }

      case EntryType.OccupationalHealthcare: {
        if('employerName' in object) {
          const employerName = parseEmployerName(object.employerName);
          const newEntry: EntryWithoutId = {
            ...baseEntry,
            type: EntryType.OccupationalHealthcare,
            employerName,
            ...('sickLeave' in object ? parseSickLeave(object.sickLeave) : {})
          };
            return newEntry;
          }
          throw new Error('Incorrect data: missing employerName');
      }

      case EntryType.Hospital: {
        if('discharge' in object){
          const discharge = parseDischarge(object.discharge);
          const newEntry: EntryWithoutId = {
            ...baseEntry,
            type: EntryType.Hospital,
            discharge
          };
          return newEntry;
          }
          throw new Error('Incorrect data: missing discharge');
      }
      default:
        throw new Error('Unknown or invalid entry type');
    }

  }

  throw new Error('Incorrect data: some fields are missing');
};

export default toNewEntry;

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description');
  }
  return description;

};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }
  return specialist;
};

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
  if (healthCheckRating === undefined || healthCheckRating === null) {
    throw new Error('Missing healthCheckRating');
  }
  if (!isHealthCheckRating(healthCheckRating)) {
    throw new Error(`Incorrect healthCheckRating: ${JSON.stringify(healthCheckRating)}`);
  }
  return healthCheckRating;
};

const parseType = (type: unknown): EntryType => {
  if (!type || !isString(type) || !isType(type)) {
    throw new Error('Incorrect or missing type');
  }
  return type;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object') { 
    return [] as Array<Diagnosis['code']>;
  }

  return object as Array<Diagnosis['code']>;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) throw new Error('Incorrect or missing employerName');
  return employerName;
};

const parseSickLeave = (sickLeave: unknown): { startDate: string; endDate: string } | undefined => {
  if (!sickLeave) return undefined;
  if (typeof sickLeave !== 'object' || Array.isArray(sickLeave)) throw new Error('Incorrect sickLeave');
  const sl = sickLeave as { startDate?: unknown; endDate?: unknown };
  if (!sl.startDate || !sl.endDate) throw new Error('Missing sickLeave dates');
  if (!isString(sl.startDate) || !isString(sl.endDate)) throw new Error('Invalid sickLeave dates');
  if (!isDate(sl.startDate) || !isDate(sl.endDate)) throw new Error('Invalid sickLeave dates');
  return { startDate: sl.startDate, endDate: sl.endDate };
};

const parseDischarge = (discharge: unknown): { date: string; criteria: string } => {
  if (!discharge || typeof discharge !== 'object' || Array.isArray(discharge)) throw new Error('Incorrect or missing discharge');
  const d = discharge as { date?: unknown; criteria?: unknown };
  if (!d.date || !d.criteria) throw new Error('Missing discharge fields');
  if (!isString(d.date) || !isString(d.criteria)) throw new Error('Invalid discharge fields');
  if (!isDate(d.date)) throw new Error('Invalid discharge date');
  return { date: d.date, criteria: d.criteria };
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isHealthCheckRating = (param: unknown): param is HealthCheckRating => {
  return typeof param === 'number' && Number.isInteger(param) && Object.values(HealthCheckRating).includes(param);
};

const isType = (param: string): param is EntryType => {
  return Object.values(EntryType).map(v => v.toString()).includes(param);
};
