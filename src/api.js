import axios from "axios";

const UNSPLASH_ACCESS_KEY = "iqQIdpOS6PnymjIlCu97K0xL1pjdQ9TSJnnL2WGfRCg"; // Replace with your actual key

export const fetchImages = async (query) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    return response.data.results; // Returns an array of image objects
  } catch (error) {
    console.error("Error fetching images:", error);
    return ""; // Return empty string if fetching fails
  }
};
