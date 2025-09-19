import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import contactRouter from '../../routes/contact.js';
import ContactController from '../../controllers/contactController.js';

// Mock del ContactController
jest.mock('../../controllers/contactController.js');

// Mock de middlewares
jest.mock('../../middleware/validation.js', () => ({
  validateContactData: (req, res, next) => {
    // Simular validación exitosa
    if (req.body.email && req.body.nombre) {
      next();
    } else {
      res.status(400).json({ error: 'Validation failed' });
    }
  },
  logRequest: (req, res, next) => {
    // Simular logging
    next();
  }
}));

jest.mock('../../middleware/rateLimiter.js', () => ({
  emailRateLimiter: (req, res, next) => {
    // Simular rate limiter exitoso
    next();
  }
}));

describe('Contact Routes', () => {
  let app;
  let mockContactController;

  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar mock del controlador
    mockContactController = {
      processContact: jest.fn((req, res, next) => {
        res.status(200).json({
          success: true,
          message: 'Email enviado exitosamente',
          data: {
            trackingId: 'MC_123_test',
            confirmacionEnviada: true,
            timestamp: '2023-01-01T00:00:00.000Z'
          }
        });
      }),
      getStats: jest.fn((req, res) => {
        res.json({
          success: true,
          stats: {
            emailsEnviados: 5,
            errores: 1,
            uptime: { seconds: 3600, formatted: '0d 1h 0m' },
            tasaExito: '83.33'
          }
        });
      })
    };

    // Mock del constructor
    ContactController.mockImplementation(() => mockContactController);

    // Configurar aplicación Express
    app = express();
    app.use(express.json());
    app.use('/api/contact', contactRouter);
  });

  describe('POST /api/contact', () => {
    test('debe procesar solicitud de contacto válida', async () => {
      const contactData = createTestContactData();

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Email enviado exitosamente',
        data: {
          trackingId: 'MC_123_test',
          confirmacionEnviada: true,
          timestamp: '2023-01-01T00:00:00.000Z'
        }
      });

      expect(mockContactController.processContact).toHaveBeenCalledTimes(1);
    });

    test('debe llamar a processContact con parámetros correctos', async () => {
      const contactData = createTestContactData();

      await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(200);

      const [req, res, next] = mockContactController.processContact.mock.calls[0];
      expect(req.body).toEqual(contactData);
      expect(res).toBeDefined();
      expect(next).toBeInstanceOf(Function);
    });

    test('debe fallar con datos inválidos', async () => {
      const invalidData = {
        // Faltan campos requeridos
        mensaje: 'Solo mensaje sin email ni nombre'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body).toEqual({ error: 'Validation failed' });
      expect(mockContactController.processContact).not.toHaveBeenCalled();
    });

    test('debe aplicar rate limiting', async () => {
      // Mock de rate limiter que falla
      const rateLimiterMock = require('../../middleware/rateLimiter.js');
      rateLimiterMock.emailRateLimiter = jest.fn((req, res, next) => {
        res.status(429).json({ error: 'Rate limit exceeded' });
      });

      // Recrear el router con el nuevo mock
      jest.resetModules();
      const newContactRouter = require('../../routes/contact.js').default;
      const newApp = express();
      newApp.use(express.json());
      newApp.use('/api/contact', newContactRouter);

      const contactData = createTestContactData();

      const response = await request(newApp)
        .post('/api/contact')
        .send(contactData)
        .expect(429);

      expect(response.body).toEqual({ error: 'Rate limit exceeded' });
    });

    test('debe manejar errores del controlador', async () => {
      mockContactController.processContact.mockImplementation((req, res, next) => {
        const error = new Error('Error procesando contacto');
        next(error);
      });

      const contactData = createTestContactData();

      // Sin middleware de error handler, Express retorna 500 por defecto
      await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(500);
    });

    test('debe procesar diferentes tipos de interés', async () => {
      const tiposInteres = [
        'voluntario-campo',
        'investigacion',
        'divulgacion',
        'financiamiento',
        'tesis',
        'servicio-social',
        'practica-profesional'
      ];

      for (const tipo of tiposInteres) {
        const contactData = createTestContactData({ tipoInteres: tipo });

        await request(app)
          .post('/api/contact')
          .send(contactData)
          .expect(200);
      }

      expect(mockContactController.processContact).toHaveBeenCalledTimes(tiposInteres.length);
    });

    test('debe procesar emails UVG y externos', async () => {
      const emails = [
        'estudiante@uvg.edu.gt',
        'profesor@uvg.edu.gt',
        'externo@gmail.com',
        'colaborador@otra-universidad.edu'
      ];

      for (const email of emails) {
        const contactData = createTestContactData({ email });

        await request(app)
          .post('/api/contact')
          .send(contactData)
          .expect(200);
      }

      expect(mockContactController.processContact).toHaveBeenCalledTimes(emails.length);
    });

    test('debe manejar caracteres especiales en datos', async () => {
      const contactData = createTestContactData({
        nombre: 'José María Ñúñez-García',
        mensaje: 'Mensaje con acentos: ñáéíóúü y símbolos: ©®™'
      });

      await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(200);

      const [req] = mockContactController.processContact.mock.calls[0];
      expect(req.body.nombre).toBe('José María Ñúñez-García');
      expect(req.body.mensaje).toBe('Mensaje con acentos: ñáéíóúü y símbolos: ©®™');
    });
  });

  describe('GET /api/contact/stats', () => {
    test('debe retornar estadísticas del servicio', async () => {
      const response = await request(app)
        .get('/api/contact/stats')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        stats: {
          emailsEnviados: 5,
          errores: 1,
          uptime: { seconds: 3600, formatted: '0d 1h 0m' },
          tasaExito: '83.33'
        }
      });

      expect(mockContactController.getStats).toHaveBeenCalledTimes(1);
    });

    test('debe llamar a getStats con parámetros correctos', async () => {
      await request(app)
        .get('/api/contact/stats')
        .expect(200);

      const [req, res] = mockContactController.getStats.mock.calls[0];
      expect(req).toBeDefined();
      expect(res).toBeDefined();
      expect(req.method).toBe('GET');
    });

    test('debe manejar errores en estadísticas', async () => {
      mockContactController.getStats.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Error obteniendo estadísticas' });
      });

      const response = await request(app)
        .get('/api/contact/stats')
        .expect(500);

      expect(response.body).toEqual({ error: 'Error obteniendo estadísticas' });
    });
  });

  describe('Middleware integration', () => {
    test('debe aplicar logRequest middleware', async () => {
      const logRequestMock = require('../../middleware/validation.js').logRequest;
      const spy = jest.spyOn(logRequestMock, 'apply');

      const contactData = createTestContactData();

      await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(200);

      // El middleware se aplica en cada request
      expect(spy).toHaveBeenCalled();
    });

    test('debe aplicar validateContactData antes de processContact', async () => {
      const validationMock = require('../../middleware/validation.js').validateContactData;
      const validationSpy = jest.fn(validationMock);

      // Recrear router con spy
      jest.doMock('../../middleware/validation.js', () => ({
        validateContactData: validationSpy,
        logRequest: (req, res, next) => next()
      }));

      const contactData = createTestContactData();

      await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(200);

      expect(validationSpy).toHaveBeenCalled();
      expect(mockContactController.processContact).toHaveBeenCalled();
    });

    test('debe aplicar emailRateLimiter antes de validación', async () => {
      const rateLimiterMock = require('../../middleware/rateLimiter.js').emailRateLimiter;
      const rateLimiterSpy = jest.fn(rateLimiterMock);

      jest.doMock('../../middleware/rateLimiter.js', () => ({
        emailRateLimiter: rateLimiterSpy
      }));

      const contactData = createTestContactData();

      await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(200);

      expect(rateLimiterSpy).toHaveBeenCalled();
    });
  });

  describe('Request/Response headers', () => {
    test('debe aceptar Content-Type application/json', async () => {
      const contactData = createTestContactData();

      await request(app)
        .post('/api/contact')
        .set('Content-Type', 'application/json')
        .send(contactData)
        .expect(200);
    });

    test('debe retornar Content-Type application/json', async () => {
      const response = await request(app)
        .get('/api/contact/stats')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    test('debe manejar headers adicionales correctamente', async () => {
      const contactData = createTestContactData();

      const response = await request(app)
        .post('/api/contact')
        .set('User-Agent', 'Test Client')
        .set('X-Forwarded-For', '192.168.1.1')
        .send(contactData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Edge cases y validaciones adicionales', () => {
    test('debe manejar payload muy grande', async () => {
      const contactData = createTestContactData({
        mensaje: 'A'.repeat(10000) // Mensaje muy largo
      });

      await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(200);
    });

    test('debe manejar payload vacío', async () => {
      await request(app)
        .post('/api/contact')
        .send({})
        .expect(400);

      expect(mockContactController.processContact).not.toHaveBeenCalled();
    });

    test('debe manejar métodos HTTP no soportados', async () => {
      await request(app)
        .put('/api/contact')
        .send(createTestContactData())
        .expect(404);

      await request(app)
        .delete('/api/contact')
        .expect(404);

      await request(app)
        .patch('/api/contact')
        .send(createTestContactData())
        .expect(404);
    });

    test('debe manejar rutas inexistentes', async () => {
      await request(app)
        .get('/api/contact/inexistente')
        .expect(404);

      await request(app)
        .post('/api/contact/inexistente')
        .send({})
        .expect(404);
    });
  });
});