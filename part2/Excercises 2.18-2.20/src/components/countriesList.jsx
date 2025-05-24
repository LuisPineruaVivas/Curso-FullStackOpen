const CountriesList = ({ countries, search }) => {
    return (
        <div>
            {Object.keys(countries).map(country => {
                return (
                    <div key={country}>
                        <p>{countries[country].name.common} <button onClick={() => search(countries[country].name.common)}>Show</button></p>
                    </div>
                )
            })}
        </div>
    )
}

export default CountriesList

