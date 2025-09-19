import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

// Importar configuración y middlewares
import appConfig from './config/app.js';
import { validateConfig } from './config/email.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler, sanitizeResponse, validateSecurityConfig } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

// Importar rutas
import apiRoutes from './routes/index.js';

class MicrocuencaApp {
  constructor() {
    this.app = express();
    this.initializeApp();
  }

  initializeApp() {
    try {
      validateSecurityConfig();
      validateConfig();
      this.setupSecurity();
      this.setupMiddlewares();
      this.setupRoutes();
      this.setupErrorHandling();
      
      logger.info('Aplicación inicializada correctamente');
    } catch (error) {
      logger.error('Error inicializando aplicación:', error);
      process.exit(1);
    }
  }

  setupSecurity() {
    if (appConfig.security.helmetEnabled) {
      this.app.use(helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"]
          }
        }
      }));
    }

    if (appConfig.security.corsEnabled) {
      this.app.use(cors({
        origin: appConfig.corsOrigins,
        credentials: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      }));
    }

    this.app.use(generalRateLimiter);
    this.app.use(sanitizeResponse)

  }

  setupMiddlewares() {
    this.app.use(express.json({ limit: '1mb', strict: true }));
    this.app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    this.app.set('trust proxy', 1);
  }

  setupRoutes() {
    this.app.use('/api', apiRoutes);

    this.app.get('/', (req, res) => {
      res.json({
        message: '🌿 API del Proyecto de Conservación de Microcuenca',
        version: '1.0.0',
        status: 'running',
        api: '/api',
        health: '/api/health',
        timestamp: new Date().toISOString()
      });
    });
  }

  setupErrorHandling() {
    this.app.use(notFoundHandler);
    
    // Error handler global
    this.app.use(errorHandler);
  }

  start() {
    const port = appConfig.port;
    
    this.server = this.app.listen(port, () => {
      logger.info(`🌿 Servidor iniciado en puerto ${port}`, {
        environment: appConfig.nodeEnv,
        corsOrigins: appConfig.corsOrigins,
        rateLimiting: appConfig.rateLimiting.maxRequests + ' emails/hora'
      });
    });

    this.setupGracefulShutdown();
  }

  setupGracefulShutdown() {
    const shutdown = (signal) => {
      logger.info(`${signal} recibido, cerrando servidor...`);
      
      this.server.close(() => {
        logger.info('Servidor cerrado exitosamente');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forzando cierre del servidor');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}

// Inicializar aplicación
const app = new MicrocuencaApp();
app.start();

export default MicrocuencaApp;