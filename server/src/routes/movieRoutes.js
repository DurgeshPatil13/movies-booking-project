import { Router } from 'express';
import { movies } from '../data/moviesData.js';
import { validateParamId } from '../middleware/requestValidator.js';

const router = Router();

// GET /api/movies
router.get('/', (req, res) => {
  let result = [...movies];
  const { genre, search, language, status } = req.query;

  if (search) {
    const q = search.toLowerCase().trim();
    result = result.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.synopsis.toLowerCase().includes(q) ||
      m.cast.some(actor => actor.toLowerCase().includes(q))
    );
  }

  if (genre && genre !== 'All') {
    result = result.filter(m =>
      m.genres.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  }

  if (language && language !== 'All') {
    result = result.filter(m =>
      m.language.toLowerCase() === language.toLowerCase()
    );
  }

  if (status === 'now-showing') {
    result = result.filter(m => m.isNowShowing);
  } else if (status === 'upcoming') {
    result = result.filter(m => m.isUpcoming);
  }

  res.json({
    success: true,
    count: result.length,
    data: result
  });
});

// GET /api/movies/:id
router.get('/:id', validateParamId('id'), (req, res) => {
  const movie = movies.find(m => m.id === req.params.id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: `Movie not found with ID: ${req.params.id}`
    });
  }

  res.json({
    success: true,
    data: movie
  });
});

export default router;
