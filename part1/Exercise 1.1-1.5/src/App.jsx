import { useState } from "react"

const Header = (props) => {
  console.log(props)
  return <h1>{props.course}</h1>
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map(part => (
        <p key={part.name}><b>{part.name}</b> <br /> Exercises {part.exercises}</p>

      ))}
      
    </div>
  )
}

const Total = (props) => {
  return (
    <p>
      Number of exercises {props.parts.reduce((sum, part) => sum + part.exercises, 0)}
    </p>
  )
}


const App = () => {
  const course = {
    name : 'Half Stack application development',
    parts : [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default App