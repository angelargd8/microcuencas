import express from 'express';
import contactRoutes from './contact.js';
import ConfigController from '../controllers/configController.js';
import ContactController from '../controllers/contactController.js';

const router = express.Router();
const contactController = new ContactController();

// Rutas principales
router.use('/contact', contactRoutes);

// GET /api/config - Configuración pública
router.get('/config', ConfigController.getPublicConfig);

// GET /api/health - Health check
router.get('/health', (req, res) => contactController.healthCheck(req, res));

// GET /api/stats - Estadísticas generales (alias)
router.get('/stats', (req, res) => contactController.getStats(req, res));

// GET /api - Info de la API
router.get('/', (req, res) => {
  res.json({
    name: 'Microcuenca Email API',
    version: '1.0.0',
    description: 'API para gestión de emails del proyecto de conservación de microcuenca',
    endpoints: {
      contact: 'POST /api/contact',
      config: 'GET /api/config',
      health: 'GET /api/health',
      stats: 'GET /api/stats'
    },
    documentation: 'https://github.com/angelargd8/microcuencas',
    timestamp: new Date().toISOString()
  });
});

export default router;
