import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [cancelButton, setCancelButton] = useState(false);
  const [searchName, setSearchName] = useState("");

  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  };

  const handleSearch = () => {
    const filteredCountries = countries.filter(
      (country) =>
        country.name.common.slice(0, searchName.length).toLowerCase()=== searchName.toLowerCase()
    );
    setCountries(filteredCountries);
    setCancelButton(true);
  };

  const handleCancel = () => {
    getAllCountries();
    setCancelButton(false);
    setSearchName("");
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
    <>
      <h1>Countries List</h1>
      <input
        type="text"
        value={searchName}
        onChange={handleSearchName}
        placeholder="Search for a country"
        className="py-1 px-2 "
      />
      <button onClick={handleSearch} className="m-3 bg-slate-500 p-1">
        Search
      </button>
      {cancelButton && (
        <button className="bg-slate-500 p-1" onClick={handleCancel}>
          Cancel
        </button>
      )}

      {countries.map((country) => (
        <div
          key={country.name.common}
          className="bg-gray-100 flex m-3 justify-center items-center"
        >
          <h3 className="text-black">{country.name.common}</h3>
          <h5 className="text-black">, {country.capital} , </h5>
          <img
            src={country.flags.png}
            alt={country.name.common}
            className="h-4"
          />
        </div>
      ))}
    </>
  );
}
