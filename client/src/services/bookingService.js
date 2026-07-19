import axios from "../api";

export const createBooking = (bookingData, token) => {
  return axios.post(`${import.meta.env.VITE_API_URL}/api/bookings`, bookingData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getBookingHistory = (userId, token) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/history/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const cancelBooking = (bookingId, token) => {
  return axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/cancel/${bookingId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// New single booking fetch function
export const getBookingById = (bookingId, token) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};