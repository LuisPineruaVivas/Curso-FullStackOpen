import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const Country = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        const lat = country.latlng[0]
        const lon = country.latlng[1]

        weatherService
            .getAll({ lat, lon })
            .then(initialWeather => {
                setWeather(initialWeather)
            })
    }, [country])

    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area}</p>
            <h3>Languages</h3>
            <ul>
                {country.languages ? Object.keys(country.languages).map(language => (
                    <li key={language}>{country.languages[language]}</li>
                )): (
                    <li>No hay lenguajes disponibles</li>
                )}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
            {weather && (
                <div>
                    <h3>Weather in {country.capital}</h3>
                    <p>Temperature: {weather.current.temp}° Celcius</p>
                    <img src={`http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`} alt={weather.current.weather[0].description} />
                    <p>Wind: {weather.current.wind_speed} m/s</p>
                </div>
            )}
        </div>
    )
}
export default Country