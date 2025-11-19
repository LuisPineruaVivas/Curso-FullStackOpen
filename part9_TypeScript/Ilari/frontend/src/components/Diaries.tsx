import type { diarientry } from "../type";

interface DiariesProps {
    diaries: diarientry[];
}

const Diaries = ({ diaries }: DiariesProps) => {
  return (
    <div>
        <h2>Diary Entries</h2>
        {diaries.map(diary =>
            <div key={diary.id}>
                <p style={{fontWeight: "bold", fontSize: "20px"}}>{diary.date}</p>
                <p >Visibility: {diary.visibility} <br /> Weather: {diary.weather}</p>
            </div>
           
        )}
    </div>
  )
}

export default Diaries