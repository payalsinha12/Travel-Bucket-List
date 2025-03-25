import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { FaCheckCircle, FaTrash, FaPlane, FaSyncAlt } from "react-icons/fa";
import axios from "axios";
import Switch from "react-switch";

// ✅ Replace with your actual Unsplash API Key
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

// ✅ Function to fetch images & descriptions from Unsplash API
const fetchImage = async (placeName) => {
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: { query: placeName, per_page: 1 },
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });

    if (response.data.results.length > 0) {
      const image = response.data.results[0];
      return {
        imageUrl: image.urls.small,
        description: image.alt_description || "A beautiful place to explore.", // ✅ Added description
      };
    }
    return {
      imageUrl: "https://via.placeholder.com/150",
      description: "No description available.",
    };
  } catch (error) {
    console.error("Error fetching image:", error);
    return {
      imageUrl: "https://via.placeholder.com/150",
      description: "No description available.",
    };
  }
};

const travelQuotes = [
  "Travel is the only thing you buy that makes you richer.",
  "Adventure awaits!",
  "Not all those who wander are lost.",
  "To travel is to live.",
  "The world is too big to stay in one place.",
  "Live with no excuses, travel with no regrets.",
];

const CATEGORIES = ["Mountain", "City", "Beach"];

function App() {
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [quote, setQuote] = useState(travelQuotes[Math.floor(Math.random() * travelQuotes.length)]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedPlaces = JSON.parse(localStorage.getItem("travelBucketList")) || [];
    setPlaces(savedPlaces);
  }, []);

  useEffect(() => {
    localStorage.setItem("travelBucketList", JSON.stringify(places));
  }, [places]);

  const addPlace = async () => {
    if (newPlace.trim() !== "") {
      const { imageUrl, description } = await fetchImage(newPlace);
      setPlaces([...places, { name: newPlace, visited: false, category, imageUrl, description }]);
      setNewPlace("");
    }
  };

  const toggleVisited = useCallback((index) => {
    setPlaces((prev) =>
      prev.map((place, i) => (i === index ? { ...place, visited: !place.visited } : place))
    );
  }, []);

  const deletePlace = useCallback((index) => {
    setPlaces((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const refreshQuote = () => {
    setQuote(travelQuotes[Math.floor(Math.random() * travelQuotes.length)]);
  };

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <div className="dark-mode-toggle">
        <Switch onChange={() => setDarkMode(!darkMode)} checked={darkMode} />
      </div>

      <div className="overlay">
        <h1>🌍 Travel Bucket List</h1>
        <p className="quote">"{quote}"</p>
        <button onClick={refreshQuote} className="refresh-quote">
          <FaSyncAlt /> New Quote
        </button>

        <div className="input-container">
          <input type="text" placeholder="Add a new place..." value={newPlace} onChange={(e) => setNewPlace(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button onClick={addPlace}><FaPlane /> Add</button>
        </div>

        <div className="places-row">
          {places.length === 0 ? (
            <p className="empty-list">No places added yet. Start exploring!</p>
          ) : (
            places.map((place, index) => (
              <div key={index} className={`place-card ${place.visited ? "visited" : ""}`}>
                <img src={place.imageUrl} alt={place.name} className="place-image" />
                <div className="place-info">
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>
                  <div className="buttons">
                    <button onClick={() => toggleVisited(index)} className="check-btn">
                      <FaCheckCircle color={place.visited ? "green" : "gray"} />
                    </button>
                    <button onClick={() => deletePlace(index)} className="delete-btn">
                      <FaTrash color="red" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
