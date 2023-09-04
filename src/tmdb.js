// src/tmdb.js
import axios from 'axios';

const API_KEY = '4787a2d15b54c8bfc23008da84dd0c13'; // Ganti dengan API key Anda
const BASE_URL = 'https://api.themoviedb.org/3/';

const tmdb = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    },
});

export default tmdb;
