import axios from "axios";

const API_URL = "http://localhost:5000/api/guides";

export const getGuides = () => {
  return axios.get(API_URL);
};