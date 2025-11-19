import { useEffect, useState } from "react";

import { TextField, Grid, Button, Alert, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import { Diagnosis, EntryWithoutId, HealthCheckRating, Patient } from "../../types";
import MenuItem from '@mui/material/MenuItem';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { EntryType } from "../../types";
import InputLabel from '@mui/material/InputLabel';
import patientService from "../../services/patients";


interface Props {
    onSubmit: (values: EntryWithoutId) => Promise<Patient | string>;
    error?: string;
}

const entryTypes: EntryType[] = [EntryType.HealthCheck, EntryType.OccupationalHealthcare, EntryType.Hospital];
const healthCheckRatings: HealthCheckRating[] = [HealthCheckRating.Healthy, HealthCheckRating.LowRisk, HealthCheckRating.HighRisk, HealthCheckRating.CriticalRisk];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 750,
    },
  },
  disableScrollLock: true,
  disablePortal: true
};


const NewEntryForm  = ({ onSubmit, error }: Props) => {
  const [description, setDescription] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<Diagnosis['code']>>([]);
  const [date, setDate] = useState('');
  const [type, setType] = useState<EntryType>(EntryType.HealthCheck);
  const[ employerName, setEmployerName ] = useState('');
  const [sickLeave, setSickLeave] = useState({startDate: '', endDate: ''});
  const [discharge, setDischarge] = useState({date: '', criteria: ''});

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  
      useEffect(() => {    
          const fetchDiagnoses = async () => {
            const diagnosesData = await patientService.getDiagnoses();
            setDiagnoses(diagnosesData);
          };
      
          void fetchDiagnoses();
        }, []);

  const addEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (type === EntryType.HealthCheck) {
        await onSubmit({
            description,
            healthCheckRating: Number(healthCheckRating),
            type,
            specialist,
            diagnosisCodes,
            date
        }).then((response) => {
            if (typeof response === 'string') {
                return;
            }
            setDescription('');
            setHealthCheckRating(HealthCheckRating.Healthy);
            setSpecialist('');
            setDiagnosisCodes([]);
            setDate('');
        });
    }
    if (type === EntryType.OccupationalHealthcare) {
        await onSubmit({
            description,
            type,
            specialist,
            diagnosisCodes,
            date,
            employerName,
            sickLeave: sickLeave.startDate && sickLeave.endDate ? sickLeave : undefined
        }).then((response) => {
            if (typeof response === 'string') {
                return;
            }
            setDescription('');
            setSpecialist('');
            setDiagnosisCodes([]);
            setDate('');
            setEmployerName('');
            setSickLeave({startDate: '', endDate: ''});
        });
    }
    if (type === EntryType.Hospital) {
        await onSubmit({
            description,
            type,
            specialist,
            diagnosisCodes,
            date,
            discharge: discharge
        }).then((response) => {
            if (typeof response === 'string') {
                return;
            }
            setDescription('');
            setSpecialist('');
            setDiagnosisCodes([]);
            setDate('');
            setDischarge({date: '', criteria: ''});
        });
    }
    
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setType(
      value as EntryType,
    );
  };

  const handleRatingChange = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setHealthCheckRating(value as unknown as HealthCheckRating);
  };

  const handleDiagnosisCodesChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    console.log(diagnosisCodes);
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div className="form" style={{ border: "2px dashed black", marginBottom: "10px", padding: "10px" }}>
        <h3>New Entry</h3>
        {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={addEntry}>
        <InputLabel id="description-label">Description</InputLabel>
        <TextField
          placeholder="Description"
          fullWidth 
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <InputLabel id="date-label">Date</InputLabel>
        <TextField
          type="date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <InputLabel id="specialist-label">Specialist</InputLabel>
        <TextField
          placeholder="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />

        <InputLabel id="diagnosisCodes-label">Diagnosis Codes</InputLabel>
        <Select
          style={{width: "100%"}}
          labelId="Diagnosis Codes"
          id="diagnosisCodes-select"
          multiple
          value={diagnosisCodes}
          onChange={handleDiagnosisCodesChange}
          input={<OutlinedInput label="Tag" />}
          MenuProps={MenuProps}
          renderValue={(selected) => selected.join(', ')}
        >
          {diagnoses.map((diagnosis) => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              <Checkbox checked={diagnosisCodes.indexOf(diagnosis.code) > -1} />
              <ListItemText primary={diagnosis.code} secondary={diagnosis.name} />
            </MenuItem>

          ))}
        </Select>

        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          id="type-select"
          value={type}
          onChange={handleChange}
          input={<OutlinedInput label="Type" />}
        >
          {entryTypes.map((entry) => (
                <MenuItem
                    key={entry}
                    value={entry}
                >
                    {entry}
                </MenuItem>
                ))}
        </Select>
        {
            type === EntryType.HealthCheck && (
                <>
                <InputLabel id="healthCheckRating-label">Health Check Rating</InputLabel>
                <Select
                labelId="healthCheckRating-label"
                id="type-select"
                value={healthCheckRating.toString()}
                onChange={handleRatingChange}
                input={<OutlinedInput label="Type" />}
                >
                {healthCheckRatings.map((rating) => (
                        <MenuItem
                            key={rating}
                            value={rating}
                        >
                            {rating}
                        </MenuItem>
                        ))}
                </Select>
                </>
                )
        }
        {
            type === EntryType.OccupationalHealthcare && (
                <>
                <InputLabel id="employerName-label">Employer Name</InputLabel>
                <TextField
                    placeholder="Employer Name"
                    fullWidth
                    value={employerName}
                    onChange={({ target }) => setEmployerName(target.value)}
                    />
                <InputLabel id="sickLeave-startDate-label">Sick Leave Start Date</InputLabel>
                <TextField
                    fullWidth
                    type="date"
                    value={sickLeave.startDate}
                    onChange={({ target }) => setSickLeave({...sickLeave, startDate: target.value})}
                    />
                <InputLabel id="sickLeave-endDate-label">Sick Leave End Date</InputLabel>
                <TextField
                    type="date"
                    fullWidth
                    value={sickLeave.endDate}
                    onChange={({ target }) => setSickLeave({...sickLeave, endDate: target.value})}
                    />
                </>
                )
        }
        {
            type === EntryType.Hospital && (
                <>
                <InputLabel id="discharge-date-label">Discharge Date</InputLabel>
                <TextField
                    type="date"
                    fullWidth
                    value={discharge.date}
                    onChange={({ target }) => setDischarge({...discharge, date: target.value})}
                    />
                <InputLabel id="discharge-criteria-label">Discharge Criteria</InputLabel>
                <TextField
                    placeholder="Discharge Criteria"
                    fullWidth
                    value={discharge.criteria}
                    onChange={({ target }) => setDischarge({...discharge, criteria: target.value})}
                    />
                </>
                )
        }

        <Grid container spacing={2} style={{ marginTop: 10, justifyContent: "space-between" }}>
          <Grid item>
            <Button
              color="error"
              variant="contained"
              type="button"
              onClick={() => {}}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default NewEntryForm ;