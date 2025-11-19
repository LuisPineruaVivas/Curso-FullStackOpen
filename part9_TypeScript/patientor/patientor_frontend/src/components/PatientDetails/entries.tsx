import { useEffect, useState } from "react";
import { Diagnosis, Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from "../../types";
import FavoriteIcon from '@mui/icons-material/Favorite';
import patientService from "../../services/patients";

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

    useEffect(() => {    
        const fetchDiagnoses = async () => {
          const diagnosesData = await patientService.getDiagnoses();
          setDiagnoses(diagnosesData);
        };
    
        void fetchDiagnoses();
      }, []);

  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} diagnoses={diagnoses} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} diagnoses={diagnoses} />;

  }
};

const HospitalEntryDetails: React.FC<{ entry: HospitalEntry, diagnoses: Diagnosis[] }> = ({ entry, diagnoses }) => (
  <div style={{ border: "2px solid black", marginBottom: "10px", padding: "10px" }}>
    <h4>{entry.date} 🏥</h4>
    <p>{entry.description}</p>
    <p>Discharge Date: {entry.discharge.date}</p>
    <p>Criteria: {entry.discharge.criteria}</p>
    <ul>
        {entry.diagnosisCodes?.map((code) => (
            <li key={code}>
            {code} {diagnoses.find(d => d.code === code)?.name}
            </li>
        ))}
    </ul>
  </div>
);

const HealthCheckEntryDetails: React.FC<{ entry: HealthCheckEntry, diagnoses: Diagnosis[] }> = ({ entry, diagnoses }) => (
  <div style={{ border: "2px solid black", marginBottom: "10px", padding: "10px" }}>
    <h4>{entry.date} 🩺</h4>
    <p>{entry.description}</p>
    <p>{healthCheckRatingToColor(entry.healthCheckRating)}</p>
    <p>Diagnosed by: {entry.specialist}</p>
    <ul>
        {entry.diagnosisCodes?.map((code) => (
            <li key={code}>
            {code} {diagnoses.find(d => d.code === code)?.name}
            </li>
        ))}
    </ul>
  </div>
);
const OccupationalHealthcareEntryDetails: React.FC<{ entry: OccupationalHealthcareEntry, diagnoses: Diagnosis[] }> = ({ entry, diagnoses }) => (
  <div style={{ border: "2px solid black", marginBottom: "10px", padding: "10px" }}>
    <h4>{entry.date} 🏢 {entry.employerName}</h4>
    <p>{entry.description}</p>
    <p>Diagnosed by: {entry.specialist}</p>
    <ul>
        {entry.diagnosisCodes?.map((code) => (
            <li key={code}>
            {code} {diagnoses.find(d => d.code === code)?.name}
            </li>
        ))}
    </ul>
  </div>
);



const healthCheckRatingToColor = (rating: number): JSX.Element => {
  switch (rating) {
    case 0:
      return <FavoriteIcon style={{ color: "green" }} />;
    case 1:
      return <FavoriteIcon style={{ color: "yellow" }} />;
    case 2:
      return <FavoriteIcon style={{ color: "orange" }} />;
    case 3:
      return <FavoriteIcon style={{ color: "red" }} />;
    default:
      return <FavoriteIcon style={{ color: "black" }} />;
  }
};

export default EntryDetails;