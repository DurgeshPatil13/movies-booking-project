import { Router } from 'express';

const router = Router();

// GET /api/health
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    application: 'IMovies Backend API',
    version: '1.0.0',
    mode: 'No-Database Demo',
    timestamp: new Date().toISOString()
  });
});

// GET /api/config
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      appName: 'IMovies – Movie Ticket Booking Made Simple',
      version: '1.0.0',
      database: 'None (Browser localStorage Demo Mode)',
      maxSeatsPerBooking: 8,
      convenienceFeePercent: 8,
      taxPercent: 5,
      supportedFormats: ['Standard', 'IMAX', 'Dolby Atmos', '4DX'],
      ticketTiers: [
        { tier: 'Standard', label: 'Standard Seat', description: 'Comfortable ergonomic cinema seats' },
        { tier: 'Premium', label: 'Premium Seat', description: 'Central vantage point with extra legroom' },
        { tier: 'VIP', label: 'VIP Recliner', description: 'Full motorized recliner with plush leather' }
      ]
    }
  });
});

export default router;
