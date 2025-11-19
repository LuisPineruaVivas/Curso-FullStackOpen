import dataDiagnoses from "../data/diagnoses";
import { Diagnosis } from "../types";

const getDiagnoses = (): Diagnosis[] => dataDiagnoses;

export default { getDiagnoses };