import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

const options = [
  { value: "alphabets", label: "Alphabets" },
  { value: "numbers", label: "Numbers" },
  { value: "highest_alphabet", label: "Highest Alphabet" },
];

function App() {
  document.title = "YourRollNumber"; // Change this to your actual roll number

  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error("Invalid JSON format");
      }
  
      const response = await axios.post("http://localhost:3000/bfhl", parsedInput);
      console.log("API Response:", response.data); // Log response for debugging
      setResponseData(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Invalid JSON or API error");
      setResponseData(null);
    }
  };
  

  const getFilteredResponse = () => {
    if (!responseData) return {}; // Fix: Ensure it returns an empty object
  
    console.log("Selected Filters:", selectedFilters); // Debug selected filters
    console.log("Response Data:", responseData); // Debug full API response
  
    let filteredData = {};
    selectedFilters.forEach((filter) => {
      if (responseData[filter]) {
        filteredData[filter] = responseData[filter];
      }
    });
  
    console.log("Filtered Data:", filteredData); // Debug final filtered output
    return filteredData;
  };
  

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Enter JSON Input</h2>
      <textarea
        rows="4"
        cols="50"
        placeholder='{"data": ["A", "C", "z"]}'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
  
      {responseData && (
        <>
          <h3>Select Response Filters:</h3>
          <Select
            options={options}
            isMulti
            onChange={(selectedOptions) => {
              console.log("Dropdown Selection:", selectedOptions);
              setSelectedFilters(selectedOptions.map(option => option.value));
            }}
          />
  
          {selectedFilters.length > 0 ? (
            <>
              <h3>Filtered Response:</h3>
              <pre>{JSON.stringify(getFilteredResponse(), null, 2)}</pre>
            </>
          ) : (
            <h3>Select at least one filter to see the response.</h3>
          )}
        </>
      )}
    </div>
  );
}  

export default App;
