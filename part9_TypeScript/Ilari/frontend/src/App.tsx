import { useEffect, useState } from "react"
import { createDiary, getAllDiaries } from "./diarieService"
import type { diarientry, newDiaryEntry} from "./type"
import NewDiarieForm from "./components/NewDiarieForm"
import Diaries from "./components/Diaries"
import Notification from "./components/Notification"

const App = () => {
  const [error, setError] = useState<string | null>(null)
  const [diaries, setDiaries] = useState<diarientry[]>([])
  const [newDiary, setNewDiary] = useState<newDiaryEntry>({
    date: '',
    weather: 'sunny',
    visibility: 'great',
    comment: ''
  })

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data)
    })
  }, [])

  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const createdDiary = await createDiary(newDiary)
    if (createdDiary && 'id' in createdDiary) {
      setDiaries(diaries.concat(createdDiary))
      setNewDiary({
        date: '',
        weather: 'sunny',
        visibility: 'great',
        comment: ''
      })
    } else {
      setError(`Error: Incorrect ${createdDiary?.error[0].message}`)
      setTimeout(() => {
        setError(null)
      }, 5000);

    }
    
  }

  return (
    <div>
      <Notification message={error} />
      <NewDiarieForm diaryCreation={diaryCreation} newDiary={newDiary} setNewDiary={setNewDiary} />
      <Diaries diaries={diaries} />
    </div>
  )
}

export default App
