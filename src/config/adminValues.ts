/**
 * Centralized Admin Configuration Values.
 * 
 * TODO: These values should eventually be fetched from the backend via the CONFIG and MASTER_DATA endpoints.
 * For now, they are hardcoded here to unblock development.
 */

export const AdminConfig = {
  commission: {
    platformFeePercentage: 15, // %
  },
  pricing: {
    baseHourlyRateLimit: {
      min: 200,
      max: 2000,
    },
  },
  sessionDurations: [60, 90, 120, 180, 240, 300, 360, 480, 720, 1440], // minutes
  categoryPriceMultipliers: {
    cafe_conversation: 1.0,
    city_walk: 1.0,
    art_culture: 1.0,
    food_experience: 1.0,
    shopping_assistance: 1.0,
    events: 1.0,
    business_networking: 1.0,
    bookstore: 1.0,
    wellness_walk: 1.0,
    movies: 1.5,
  } as Record<string, number>,
};
