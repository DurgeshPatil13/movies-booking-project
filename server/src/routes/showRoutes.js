import { Router } from 'express';
import { sampleShows } from '../data/showsData.js';
import { validateParamId } from '../middleware/requestValidator.js';

const router = Router();

// GET /api/shows
router.get('/', (req, res) => {
  let result = [...sampleShows];
  const { movieId, theaterId, date } = req.query;

  if (movieId) {
    result = result.filter(s => s.movieId === movieId);
  }

  if (theaterId) {
    result = result.filter(s => s.theaterId === theaterId);
  }

  if (date) {
    result = result.filter(s => s.date === date);
  }

  res.json({
    success: true,
    count: result.length,
    data: result
  });
});

// GET /api/shows/:id
router.get('/:id', validateParamId('id'), (req, res) => {
  const show = sampleShows.find(s => s.id === req.params.id);

  if (!show) {
    return res.status(404).json({
      success: false,
      message: `Show not found with ID: ${req.params.id}`
    });
  }

  res.json({
    success: true,
    data: show
  });
});

export default router;
