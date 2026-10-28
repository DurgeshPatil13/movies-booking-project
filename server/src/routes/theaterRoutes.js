import { Router } from 'express';
import { theaters } from '../data/theatersData.js';
import { validateParamId } from '../middleware/requestValidator.js';

const router = Router();

// GET /api/theaters
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: theaters.length,
    data: theaters
  });
});

// GET /api/theaters/:id
router.get('/:id', validateParamId('id'), (req, res) => {
  const theater = theaters.find(t => t.id === req.params.id);

  if (!theater) {
    return res.status(404).json({
      success: false,
      message: `Theater not found with ID: ${req.params.id}`
    });
  }

  res.json({
    success: true,
    data: theater
  });
});

export default router;
