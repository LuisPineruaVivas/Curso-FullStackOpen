import type { newDiaryEntry, Visibility, Weather } from "../type"

interface NewDiarieFormProps {
    diaryCreation: (event: React.SyntheticEvent) => void;
    newDiary: newDiaryEntry;
    setNewDiary: React.Dispatch<React.SetStateAction<newDiaryEntry>>;
}

const NewDiarieForm = ( { diaryCreation, newDiary, setNewDiary } : NewDiarieFormProps ) => {

  return (
    <div>
        <h2>Add new entry</h2>
        <form onSubmit={diaryCreation}>
            <div>
                Date: 
                <input
                value={newDiary.date}
                onChange={(event) => setNewDiary({ ...newDiary, date: event.target.value })}
                placeholder="Date"
                type="date"
                />
            </div>
            <div>
                Visibility:
                {(['great', 'good', 'ok', 'poor'] as Visibility[]).map((vis) => (
                    <label key={vis}>
                        <input
                        type="radio"
                        value={vis}
                        checked={vis === newDiary.visibility}
                        onChange={(event) => setNewDiary({ ...newDiary, visibility: event.target.value as Visibility })}
                        />
                        {vis}
                    </label>
                ))}
                
            </div>
            <div>
                Weather:
                {(['sunny', 'rainy', 'cloudy', 'stormy', 'windy'] as Weather[]).map((wea) => (
                    <label key={wea}>
                        <input
                        type="radio"
                        value={wea}
                        checked={wea === newDiary.weather}
                        onChange={(event) => setNewDiary({ ...newDiary, weather: event.target.value as Weather })}
                        />
                        {wea}
                    </label>
                ))}
            </div>
            <div>
                Comment:
                <input
                value={newDiary.comment}
                onChange={(event) => setNewDiary({ ...newDiary, comment: event.target.value })}
                placeholder="Comment"
                />
            </div>
            <button type="submit">add</button>
      </form>
    </div>
  )
}

export default NewDiarieForm