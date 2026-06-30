import axios from "axios";

const API_URL = "http://localhost:5000/api/wishlist/";

export const getWishlist = (token) => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeWishlistItem = (id, token) => {
  return axios.delete(
    `${API_URL}remove/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const addToWishlist = (packageId, token) => {
  return axios.post(
    `${API_URL}add`,
    { packageId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};