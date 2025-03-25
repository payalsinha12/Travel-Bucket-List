import React, { useState } from "react";
import "./ImageSearch.css"; // Import CSS for styling

const UNSPLASH_ACCESS_KEY = iqQIdpOS6PnymjIlCu97K0xL1pjdQ9TSJnnL2WGfRCg; // 🔹 Replace with your Unsplash API Key

const ImageSearch = () => {
    const [query, setQuery] = useState("");
    const [images, setImages] = useState([]);

    const searchImages = async () => {
        if (!query.trim()) {
            alert("Please enter a search term!");
            return;
        }

        const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=9`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setImages(data.results);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    return (
        <div className="container">
            <h1>Search Images from Unsplash</h1>
            <input 
                type="text" 
                placeholder="Search for images..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
            />
            <button onClick={searchImages}>Search</button>
            <div className="image-gallery">
                {images.map((photo) => (
                    <img key={photo.id} src={photo.urls.small} alt={photo.alt_description} />
                ))}
            </div>
        </div>
    );
};

export default ImageSearch;
