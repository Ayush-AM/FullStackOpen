const CountryList = ({ countries, handleShow }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  return (
    <ul>
      {countries.map(c => (
        <li key={c.cca3}>
          {c.name.common}{" "}
          <button onClick={() => handleShow(c)}>show</button>
        </li>
      ))}
    </ul>
  )
}

export default CountryList
