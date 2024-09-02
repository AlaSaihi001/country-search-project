import axios from "axios";
import { useEffect, useState } from "react";
import './Home.module.css'

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [cancelButton, setCancelButton] = useState(false);
  const [searchName, setSearchName] = useState("");

  const handleSearchName = (event) => {
    const value = event.target.value;
    setSearchName(value);
    const suggestions = countries.filter((country) =>
      country.name.common.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredCountries(suggestions);
  };

  const handleSelectCountry = (countryName) => {
    setSearchName(countryName);
    const selectedCountry = countries.filter(
      (country) => country.name.common === countryName
    );
    setCountries(selectedCountry);
    setFilteredCountries([]);
    setCancelButton(true);
  };

  const handleSearch = () => {
    const filtered = countries.filter(
      (country) =>
        country.name.common.slice(0, searchName.length).toLowerCase() ===
        searchName.toLowerCase()
    );
    setCountries(filtered);
    setFilteredCountries([]);
    setCancelButton(true);
  };

  const handleCancel = () => {
    getAllCountries();
    setCancelButton(false);
    setSearchName("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const getAllCountries = async () => {
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      setCountries(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCountries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Countries List</h1>
        <div className="relative mb-4">
          <input
            type="text"
            value={searchName}
            onChange={handleSearchName}
            onKeyDown={handleKeyDown}
            placeholder="Search for a country (Press Enter if you want to search many results)"
            className="border border-gray-300 rounded-l-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {filteredCountries.length > 0 && (
            <ul className="absolute z-10 w-full bg-black border border-black-300 rounded-lg shadow-lg max-h-40 overflow-y-auto mt-2">
              {filteredCountries.map((country) => (
                <li
                  key={country.name.common}
                  onClick={() => handleSelectCountry(country.name.common)}
                  className="py-2 px-4 cursor-pointer hover:bg-gray-600"
                >
                  {country.name.common}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="text-center mb-4">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
        {cancelButton && (
          <div className="text-center mb-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {countries.map((country) => (
            <div key={country.name.common} className="card">
              <img
                src={country.flags.png}
                alt={country.name.common}
                className="h-12 rounded shadow"
              />
              <div className="card__content">
                <h3 className="card__title">{country.name.common}</h3>
                <h5 className="card__description">
                  {country.capital && `Capital: ${country.capital}`}
                </h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
