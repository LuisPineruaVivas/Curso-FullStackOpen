import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import CountriesList from './components/countriesList'
import Country from './components/country'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState((''))

  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleChange = (event) => {
    setValue(event.target.value)
    setSearch(event.target.value)

    countriesService
      .getAll()
      .then(initialCountries => {
        const filteredCountries = initialCountries.filter(country =>
          country.name.common.toLowerCase().includes(event.target.value.toLowerCase())
        )
        setCountries(filteredCountries)
      })
  }

  const searchCountry = (name) => {
    setValue(name)
    setSearch(name)

    countriesService
      .getAll()
      .then(initialCountries => {
        const filteredCountries = initialCountries.filter(country =>
          country.name.common.toLowerCase().includes(name.toLowerCase())
        )
        setCountries(filteredCountries)
      })
  }

  return (
    <div>
      <form>
        Find Countries: <input value={value} onChange={handleChange} />
      </form>

      { countries.length === 1 && search ? (
        <Country country={countries[0]} />
      ) : countries.length <=10 && countries.length > 1 && search ? (
        <div>
          <h2>Countries</h2>
          <CountriesList countries={countries} search={searchCountry} />
        </div>
      ) : countries.length > 10 && search ? (
        <p> Too many matches, specify another filter </p>
      ) : (
        <p> Enter a country name to search </p>
      )}

    </div>
  )
}

export default App