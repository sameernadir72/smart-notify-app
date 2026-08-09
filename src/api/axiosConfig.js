import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your computer's local IP address (e.g., 192.168.1.5)
// Do NOT use localhost or 127.0.0.1, because the Android emulator won't find it!
const BASE_URL = 'http://192.168.100.6:3000/'; // 10.0.2.2 is the magic IP for Android Emulators

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10s timeout for requests
});

// Automatically attach the JWT token to every request
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
