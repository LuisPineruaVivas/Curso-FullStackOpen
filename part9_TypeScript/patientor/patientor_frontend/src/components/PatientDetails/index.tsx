import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EntryWithoutId, Patient } from "../../types";
import patientService from "../../services/patients";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import EntryDetails from "./entries";
import NewEntryForm from "./NewEntryForm";
import axios from "axios";


const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!id) return;
    const fetchPatientDetails = async () => {
      const patientData = await patientService.getById(id);
      setPatient(patientData);
    };

    void fetchPatientDetails();
  }, [id]);

  const getGenderSymbol = (gender: string) => {
    switch (gender) {
      case "male":
        return <MaleIcon />;
      case "female":
        return <FemaleIcon />;
      default:
        return "⚧";
    }
  };

  const submitNewHealthCheckEntry = async (values: EntryWithoutId) => {
    try {
      const entry = await patientService.addEntry(values, patient!.id);
      setPatient(entry);
      return entry;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          setError(message);
          setTimeout(() => {
            setError(undefined);
          }, 5000);
          return message;
        } else {
          setError("Unrecognized axios error");
          setTimeout(() => {
            setError(undefined);
          }, 5000);
          return "Unrecognized axios error";
        }
      } else {
        if (e instanceof Error) {
          setError(e.message);
          setTimeout(() => {
            setError(undefined);
          }, 5000);
          return e.message;
        } else {
          setError("Unknown error");
          setTimeout(() => {
            setError(undefined);
          }, 5000);
          return "Unknown error";
        }
      } 
      }
    };

  return (
    <div>
      {patient ? (
        <div>
          <h2>{patient.name} {getGenderSymbol(patient.gender)} </h2>
          <p>
            ssn: {patient.ssn} 
            <br /> 
            occupation: {patient.occupation}
          </p>
          <h3>Entries</h3>
          <NewEntryForm 
            onSubmit={submitNewHealthCheckEntry}
            error={error}
          />

          {patient.entries?.map((entry) => (
            <div key={entry.id}>
              <EntryDetails entry={entry} />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PatientDetails;