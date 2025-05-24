const Header = ({course}) => {
  return <h1>{course}</h1>
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => (
        <p key={part.name}><b>{part.name}</b> <br /> Exercises {part.exercises}</p>

      ))}
      
    </div>
  )
}

const Total = ({parts}) => {
  return (
    <strong><p>
      Total of exercises: {parts.reduce((sum, part) => sum + part.exercises, 0)}
    </p></strong>
  )
}

const Course = ({course}) => {
  console.log(course.name)
  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course