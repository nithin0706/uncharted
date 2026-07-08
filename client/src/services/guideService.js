import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/guides`;

export const getGuides = () => {
  return axios.get(API_URL);
};