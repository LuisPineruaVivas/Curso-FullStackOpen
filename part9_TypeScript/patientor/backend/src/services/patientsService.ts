import dataPatients from "../data/patients";
import { EntryType, EntryWithoutId, NewPatient, Patient, nonSensitivePatient } from "../types";
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
    return dataPatients;
};

const getNonSensitivePatients = (): nonSensitivePatient[] => {
    return dataPatients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }));
};

const findById = (id: string): Patient | undefined => {
  const patient = dataPatients.find(d => d.id === id); ;
  if (!patient) return undefined;
  return patient;
};

const addPatient = (Patient: NewPatient): Patient => {
    const newPatient = {
        id: uuid(),
        ...Patient,
        entries: Patient['entries'] ?? []
    };
    dataPatients.push(newPatient);
    return newPatient;
};

const addEntry = (Entry: EntryWithoutId, patientId: string): Patient => {
    const patient = findById(patientId);
    if (!patient) throw new Error('Patient not found');
    if( Entry.type === EntryType.HealthCheck) {
        if (Entry.healthCheckRating === undefined) throw new Error('HealthCheckRating is required');
        const newEntry = {
            id: uuid(),
            ...Entry,
            healthCheckRating: Entry.healthCheckRating,

        };
        patient.entries.push(newEntry);
        return patient;
    } else if (Entry.type === EntryType.OccupationalHealthcare) {
        if (Entry.employerName === undefined) throw new Error('EmployerName is required');
        const newEntry = {
            id: uuid(),
            ...Entry,
            employerName: Entry.employerName,
        };
        patient.entries.push(newEntry);
        return patient;
    } else {
        if (Entry.discharge === undefined) throw new Error('Discharge is required');
        const newEntry = {
            id: uuid(),
            ...Entry,
            discharge: Entry.discharge,
        };
        patient.entries.push(newEntry);
        return patient;
    }

};


export default { getPatients, getNonSensitivePatients, addPatient, findById, addEntry };