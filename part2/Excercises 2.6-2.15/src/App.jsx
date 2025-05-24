import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import Notification from './components/Notification'
import phoneService from './services/phones'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('')


  useEffect(() => {
    phoneService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const  handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    if (persons.find(person => person.name === nameObject.name)) {
      alert(`${nameObject.name} is already added to phonebook, you wish to replace the old number with a new one?`)
      const person = persons.find(person => person.name === nameObject.name)
      const changedPerson = { ...person, number: nameObject.number }
      phoneService
      .update(person.id, changedPerson).then(returnedPerson => {
        setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
        setNewName('')
        setNewNumber('')
        setFilter('')
        setErrorMessage(
          `${person.name}'s number was changed to ${nameObject.number}`
        )
        setNotificationType('success')
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      }).catch(error => {
        setErrorMessage(
          `Information of ${person.name} has already been removed from server`
        )
        setNotificationType('error')
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
        setPersons(persons.filter(p => p.id !== person.id))
      })
    } else {
      phoneService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setFilter('')
        setErrorMessage(
          `Added ${nameObject.name}`
        )
        setNotificationType('success')
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      })
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      phoneService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNewName('')
          setNewNumber('')
          setFilter('')
          setErrorMessage(
            `Deleted ${person.name}`
          )
          setNotificationType('success')
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
        })
    } else {
      return
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} type={notificationType} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      { filter ? 
        <Persons persons={persons.filter(
          person => person.name.toLowerCase().includes(filter.toLowerCase()))}
          deletePerson={deletePerson}/> : 
        <Persons persons={persons} deletePerson={deletePerson} />
      }
      
    </div>
  )
}

export default App