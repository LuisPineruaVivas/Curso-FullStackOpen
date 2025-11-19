import express, { Request, Response, NextFunction } from 'express';
import toNewEntry, { newPacientSchema } from '../utils';
import { NewPatient, nonSensitivePatient, Patient } from "../types";
import z from 'zod';

import patientsService from "../services/patientsService";

const router = express.Router();

router.get('/', (_req, res: Response<nonSensitivePatient[]>) => {
    res.send(patientsService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const patient = patientsService.findById(String(req.params.id));

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

const newPacientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newPacientSchema.parse(req.body);
    console.log(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post('/', newPacientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientsService.addPatient(req.body);
    res.json(addedPatient);
});


router.post('/:id/entries', (req, res) => {
  try{
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientsService.addEntry(newEntry, req.params.id);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.use(errorMiddleware);

export default router;