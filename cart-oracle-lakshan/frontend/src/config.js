// config.js - API base URL configuration
// In development (npm run dev), uses localhost
// In production (npm run build), uses the Render URL

export const API_BASE = import.meta.env.PROD
  ? "https://amazonnow-quickcommerce.onrender.com"
  : "http://localhost:8000";
