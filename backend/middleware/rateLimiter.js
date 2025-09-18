import rateLimit from 'express-rate-limit';
import { HTTP_STATUS, ERROR_CODES } from '../utils/constants.js';
import appConfig from '../config/app.js';

// Rate limiter específico para emails
const emailRateLimiter = rateLimit({
  windowMs: appConfig.rateLimiting.windowMs,
  max: appConfig.rateLimiting.maxRequests,
  message: {
    success: false,
    error: appConfig.rateLimiting.message,
    code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
    retryAfter: appConfig.rateLimiting.windowMs / 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting para health checks
    return req.path === '/api/health';
  }
});

// Rate limiter general más permisivo
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por ventana
  message: {
    success: false,
    error: 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.',
    code: ERROR_CODES.RATE_LIMIT_EXCEEDED
  },
  standardHeaders: true,
  legacyHeaders: false
});

export { emailRateLimiter, generalRateLimiter };