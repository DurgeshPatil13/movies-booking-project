import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import configRoutes from './routes/configRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import theaterRoutes from './routes/theaterRoutes.js';
import showRoutes from './routes/showRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors({
  origin: '*', // Allow local frontend during demo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome & API info endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'IMovies – Movie Ticket Booking Made Simple API',
    status: 'online',
    mode: 'In-Memory / Read-Only Demonstration Catalog',
    description: 'This Express backend provides catalog endpoints for movies, theaters, and showtimes. User session and ticket booking state are managed client-side in browser localStorage.',
    documentation: '/api/config',
    endpoints: {
      health: '/api/health',
      config: '/api/config',
      movies: '/api/movies',
      theaters: '/api/theaters',
      shows: '/api/shows'
    }
  });
});

// API Routes
app.use('/api', configRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/shows', showRoutes);

// Fallback error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
