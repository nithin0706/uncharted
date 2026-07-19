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