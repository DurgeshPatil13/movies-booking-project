export const theaters = [
  {
    id: "th-1",
    name: "IMovies Grand Cinema – Downtown Plaza",
    city: "Metropolis",
    address: "742 Broadway Ave, Suite 400, Downtown",
    phone: "+1 (555) 234-5678",
    facilities: ["IMAX with Laser", "Dolby Atmos", "VIP Recliners", "Gourmet Bistro", "Valet Parking"],
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
    screens: [
      { id: "scr-1-1", name: "Screen 1 - IMAX Laser", type: "IMAX", totalSeats: 64 },
      { id: "scr-1-2", name: "Screen 2 - Dolby Atmos", type: "Dolby Atmos", totalSeats: 56 },
      { id: "scr-1-3", name: "Screen 3 - Classic", type: "Standard", totalSeats: 48 }
    ]
  },
  {
    id: "th-2",
    name: "IMovies Cineplex – Metro Galleria",
    city: "Metropolis",
    address: "1200 Galleria Mall, North Wing, Level 3",
    phone: "+1 (555) 876-5432",
    facilities: ["Dolby Atmos", "Luxury Loungers", "Snack Bar", "Wheelchair Accessible"],
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    screens: [
      { id: "scr-2-1", name: "Auditorium A - Prime", type: "Dolby Atmos", totalSeats: 64 },
      { id: "scr-2-2", name: "Auditorium B - Standard", type: "Standard", totalSeats: 48 }
    ]
  },
  {
    id: "th-3",
    name: "IMovies Dome – West End Promenade",
    city: "West End",
    address: "88 Promenade Blvd, Waterfront District",
    phone: "+1 (555) 432-1098",
    facilities: ["4DX Motion Experience", "Laser Projection", "Star Lounge", "Dolby Atmos"],
    image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=800&q=80",
    screens: [
      { id: "scr-3-1", name: "Dome 1 - 4DX Immersion", type: "4DX", totalSeats: 48 },
      { id: "scr-3-2", name: "Dome 2 - IMAX Dome", type: "IMAX", totalSeats: 64 }
    ]
  }
];
