import axios from "axios";

const API_URL = "https://uncharted-60k4.onrender.com/api/wishlist";

export const getWishlist = (token) => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeWishlistItem = (id, token) => {
  return axios.delete(`${API_URL}remove/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// data = { packageId } or { destinationId }
export const addToWishlist = (data, token) => {
  return axios.post(`${API_URL}add`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
