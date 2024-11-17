import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const fetchMessages = async () => {
  const response = await axios.get(`${API_URL}/messages`);
  return response.data;
};

export const sendMessage = async (message) => {
  const response = await axios.post(`${API_URL}/messages`, { message });
  return response.data;
};
