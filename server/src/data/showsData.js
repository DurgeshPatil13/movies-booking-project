/**
 * Utility to generate date strings for the next 7 days in YYYY-MM-DD format
 */
export const getNextSevenDays = () => {
  const days = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    days.push({
      dateStr: `${yyyy}-${mm}-${dd}`,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' })
    });
  }
  return days;
};

/**
 * Generate standard visual seat layout
 * Rows A to G, 8 seats per row (56 seats total)
 * Rows A-B: VIP ($18)
 * Rows C-E: Premium ($14)
 * Rows F-G: Standard ($11)
 */
export const generateSeatLayout = (basePrice = 14) => {
  const rows = [
    { row: 'A', tier: 'VIP', priceMultiplier: 1.4 },
    { row: 'B', tier: 'VIP', priceMultiplier: 1.4 },
    { row: 'C', tier: 'Premium', priceMultiplier: 1.15 },
    { row: 'D', tier: 'Premium', priceMultiplier: 1.15 },
    { row: 'E', tier: 'Premium', priceMultiplier: 1.15 },
    { row: 'F', tier: 'Standard', priceMultiplier: 1.0 },
    { row: 'G', tier: 'Standard', priceMultiplier: 1.0 }
  ];

  const seats = [];
  rows.forEach((r) => {
    for (let num = 1; num <= 8; num++) {
      const seatId = `${r.row}${num}`;
      const seatPrice = Math.round(basePrice * r.priceMultiplier);
      seats.push({
        id: seatId,
        row: r.row,
        number: num,
        tier: r.tier,
        price: seatPrice
      });
    }
  });

  return seats;
};

/**
 * Generate show schedules dynamically for today and the next 6 days
 */
export const generateShows = () => {
  const dates = getNextSevenDays();
  const timeslots = ["10:30 AM", "01:45 PM", "04:30 PM", "07:15 PM", "10:00 PM"];
  const movieIds = ["mov-1", "mov-2", "mov-3", "mov-4", "mov-5", "mov-6", "mov-7", "mov-8", "mov-11"];
  const theaterScreens = [
    { theaterId: "th-1", theaterName: "IMovies Grand Cinema – Downtown Plaza", screenId: "scr-1-1", screenName: "Screen 1 - IMAX Laser", format: "IMAX" },
    { theaterId: "th-1", theaterName: "IMovies Grand Cinema – Downtown Plaza", screenId: "scr-1-2", screenName: "Screen 2 - Dolby Atmos", format: "Dolby Atmos" },
    { theaterId: "th-2", theaterName: "IMovies Cineplex – Metro Galleria", screenId: "scr-2-1", screenName: "Auditorium A - Prime", format: "Dolby Atmos" },
    { theaterId: "th-3", theaterName: "IMovies Dome – West End Promenade", screenId: "scr-3-1", screenName: "Dome 1 - 4DX Immersion", format: "4DX" }
  ];

  const shows = [];
  let showCounter = 1;

  dates.forEach((d, dayIdx) => {
    theaterScreens.forEach((ts, tsIdx) => {
      // Pick movie based on index offset
      const movieIdx = (dayIdx + tsIdx) % movieIds.length;
      const movieId = movieIds[movieIdx];

      // Assign 2 or 3 timeslots per screen per day
      const screenSlots = dayIdx % 2 === 0 ? [timeslots[1], timeslots[3]] : [timeslots[0], timeslots[2], timeslots[4]];

      screenSlots.forEach((slot) => {
        shows.push({
          id: `show-${showCounter++}`,
          movieId,
          theaterId: ts.theaterId,
          theaterName: ts.theaterName,
          screenId: ts.screenId,
          screenName: ts.screenName,
          format: ts.format,
          date: d.dateStr,
          time: slot,
          seats: generateSeatLayout(ts.format === 'IMAX' || ts.format === '4DX' ? 16 : 13)
        });
      });
    });
  });

  return shows;
};

export const sampleShows = generateShows();
