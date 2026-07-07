import axios from "axios";

const API_URL = "https://uncharted-60k4.onrender.com/api/guides";

export const getGuides = () => {
  return axios.get(API_URL);
};