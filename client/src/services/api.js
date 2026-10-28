import axios from 'axios';
import {
  getStoredMovies,
  getStoredMovieById,
  getStoredTheaters,
  getStoredShows,
  getStoredShowById
} from './storage.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const movieApi = {
  // Get all movies with optional filters
  getMovies: async (params = {}) => {
    try {
      const response = await apiClient.get('/movies', { params });
      return response.data.data;
    } catch (err) {
      console.warn('[API] Backend unreachable, falling back to local storage catalog:', err.message);
      let local = getStoredMovies();
      if (params.search) {
        const q = params.search.toLowerCase().trim();
        local = local.filter(m =>
          m.title.toLowerCase().includes(q) ||
          m.synopsis.toLowerCase().includes(q) ||
          (m.cast && m.cast.some(c => c.toLowerCase().includes(q)))
        );
      }
      if (params.genre && params.genre !== 'All') {
        local = local.filter(m => m.genres && m.genres.some(g => g.toLowerCase() === params.genre.toLowerCase()));
      }
      if (params.language && params.language !== 'All') {
        local = local.filter(m => m.language && m.language.toLowerCase() === params.language.toLowerCase());
      }
      if (params.status === 'now-showing') {
        local = local.filter(m => m.isNowShowing);
      } else if (params.status === 'upcoming') {
        local = local.filter(m => m.isUpcoming);
      }
      return local;
    }
  },

  // Get movie details by ID
  getMovieById: async (id) => {
    try {
      const response = await apiClient.get(`/movies/${id}`);
      return response.data.data;
    } catch (err) {
      console.warn(`[API] Fallback for movie ${id}:`, err.message);
      const local = getStoredMovieById(id);
      if (!local) throw new Error('Movie not found');
      return local;
    }
  }
};

export const theaterApi = {
  // Get all theaters
  getTheaters: async () => {
    try {
      const response = await apiClient.get('/theaters');
      return response.data.data;
    } catch (err) {
      console.warn('[API] Fallback for theaters:', err.message);
      return getStoredTheaters();
    }
  }
};

export const showApi = {
  // Get shows by filters
  getShows: async (params = {}) => {
    try {
      const response = await apiClient.get('/shows', { params });
      return response.data.data;
    } catch (err) {
      console.warn('[API] Fallback for shows:', err.message);
      return getStoredShows(params);
    }
  },

  // Get show by ID
  getShowById: async (id) => {
    try {
      const response = await apiClient.get(`/shows/${id}`);
      return response.data.data;
    } catch (err) {
      console.warn(`[API] Fallback for show ${id}:`, err.message);
      const local = getStoredShowById(id);
      if (!local) throw new Error('Show not found');
      return local;
    }
  }
};

export const systemApi = {
  getHealth: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (err) {
      return { status: 'offline', message: 'Backend server not responding' };
    }
  },
  getConfig: async () => {
    try {
      const response = await apiClient.get('/config');
      return response.data.data;
    } catch (err) {
      return null;
    }
  }
};
