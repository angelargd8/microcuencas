import express from 'express';
import ContactController from '../controllers/contactController.js';
import { validateContactData, logRequest } from '../middleware/validation.js';
import { emailRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const contactController = new ContactController();

// Middleware específico para rutas de contacto
router.use(logRequest);

// POST /api/contact - Enviar email de contacto
router.post('/', 
  emailRateLimiter,
  validateContactData,
  (req, res, next) => contactController.processContact(req, res, next)
);

// GET /api/contact/stats - Estadísticas del servicio
router.get('/stats', 
  (req, res) => contactController.getStats(req, res)
);

export default router;