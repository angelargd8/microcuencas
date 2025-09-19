import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock de todos los módulos necesarios para la integración
jest.mock('@emailjs/nodejs', () => ({
  init: jest.fn(),
  send: jest.fn().mockResolvedValue({ status: 200, text: 'Email sent' })
}));

jest.mock('../../config/email.js', () => ({
  emailConfig: {
    emailjs: {
      publicKey: 'test_public_key',
      privateKey: 'test_private_key',
      serviceId: 'test_service_id',
      templateId: 'test_template_id',
      confirmationTemplateId: 'test_confirmation_template_id'
    },
    project: {
      email: 'proyecto@test.com',
      name: 'Proyecto Test',
      university: 'Universidad Test',
      senderName: 'Test Sender'
    },
    settings: {
      enableConfirmation: true,
      timezone: 'America/Guatemala'
    }
  }
}));

jest.mock('../../utils/logger.js', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

// Mock de middlewares de validación y rate limiting
jest.mock('../../middleware/validation.js', () => ({
  validateContactData: (req, res, next) => {
    if (req.body.email && req.body.nombre) {
      next();
    } else {
      res.status(400).json({
        success: false,
        error: 'Datos de entrada no válidos',
        code: 'VALIDATION_ERROR'
      });
    }
  },
  logRequest: (req, res, next) => next()
}));

jest.mock('../../middleware/rateLimiter.js', () => ({
  emailRateLimiter: (req, res, next) => next()
}));

jest.mock('../../controllers/configController.js', () => ({
  default: {
    getPublicConfig: (req, res) => {
      res.json({
        carreras: ['ing-civil', 'ing-industrial'],
        tiposInteres: ['voluntario-campo', 'investigacion'],
        configuracion: {
          proyecto: 'Microcuencas Test',
          version: '1.0.0'
        }
      });
    }
  }
}));

describe('Integration Tests - Complete App Flow', () => {
  let app;

  beforeAll(async () => {
    // Importar la aplicación después de los mocks
    const appModule = await import('../../app.js');
    app = appModule.default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Flujo completo de envío de contacto', () => {
    test('debe procesar solicitud completa de contacto UVG', async () => {
      const contactData = {
        nombre: 'Juan Pérez',
        email: 'juan.perez@uvg.edu.gt',
        telefono: '+502 1234-5678',
        carrera: 'ing-civil',
        anioEstudio: '3',
        tipoInteres: 'voluntario-campo',
        mensaje: 'Quiero participar en el proyecto de conservación'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Email enviado exitosamente',
        data: {
          trackingId: expect.stringMatching(/^MC_\d+_[a-z0-9]+$/),
          confirmacionEnviada: true,
          timestamp: expect.any(String)
        }
      });

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    test('debe procesar solicitud de contacto externo', async () => {
      const contactData = {
        nombre: 'María García',
        email: 'maria.garcia@gmail.com',
        tipoInteres: 'investigacion',
        mensaje: 'Soy investigadora externa interesada en colaborar'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.trackingId).toBeDefined();
    });

    test('debe rechazar solicitud con datos inválidos', async () => {
      const invalidData = {
        mensaje: 'Solo mensaje, faltan datos requeridos'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Datos de entrada no válidos',
        code: 'VALIDATION_ERROR'
      });
    });
  });

  describe('Endpoints de información y monitoreo', () => {
    test('debe retornar información de la API', async () => {
      const response = await request(app)
        .get('/api/')
        .expect(200);

      expect(response.body).toEqual({
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
        timestamp: expect.any(String)
      });
    });

    test('debe retornar configuración pública', async () => {
      const response = await request(app)
        .get('/api/config')
        .expect(200);

      expect(response.body).toEqual({
        carreras: ['ing-civil', 'ing-industrial'],
        tiposInteres: ['voluntario-campo', 'investigacion'],
        configuracion: {
          proyecto: 'Microcuencas Test',
          version: '1.0.0'
        }
      });
    });

    test('debe retornar health check', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        service: 'Proyecto Microcuenca Email Service',
        version: '1.0.0',
        emailService: 'EmailJS',
        environment: 'test',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        memory: expect.any(Object),
        checks: {
          emailjsConfig: true,
          externalAPIs: 'ok'
        }
      });
    });

    test('debe retornar estadísticas del servicio', async () => {
      const response = await request(app)
        .get('/api/stats')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        stats: expect.objectContaining({
          emailsEnviados: expect.any(Number),
          errores: expect.any(Number),
          uptime: expect.objectContaining({
            seconds: expect.any(Number),
            formatted: expect.any(String)
          }),
          tasaExito: expect.any(String),
          memoria: expect.any(Object),
          version: '1.0.0'
        }),
        timestamp: expect.any(String)
      });
    });
  });

  describe('Manejo de errores y casos edge', () => {
    test('debe manejar rutas no encontradas', async () => {
      const response = await request(app)
        .get('/api/ruta-inexistente')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Endpoint no encontrado',
        code: 'NOT_FOUND',
        availableEndpoints: [
          'POST /api/contact',
          'GET /api/health',
          'GET /api/config',
          'GET /api/stats'
        ],
        timestamp: expect.any(String)
      });
    });

    test('debe manejar métodos HTTP no soportados', async () => {
      await request(app)
        .put('/api/contact')
        .send({})
        .expect(404);

      await request(app)
        .delete('/api/health')
        .expect(404);
    });

    test('debe manejar JSON malformado', async () => {
      const response = await request(app)
        .post('/api/contact')
        .set('Content-Type', 'application/json')
        .send('{"json": "malformado"')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('debe manejar payload muy grande', async () => {
      const largePayload = {
        nombre: 'A'.repeat(10000),
        email: 'test@uvg.edu.gt',
        mensaje: 'B'.repeat(50000)
      };

      // Debería ser procesado o rechazado gracefully
      const response = await request(app)
        .post('/api/contact')
        .send(largePayload);

      expect([200, 400, 413]).toContain(response.status);
    });
  });

  describe('Headers y seguridad', () => {
    test('debe incluir headers de seguridad', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
      expect(response.headers).toHaveProperty('x-xss-protection', '1; mode=block');
    });

    test('debe remover headers peligrosos', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers).not.toHaveProperty('x-powered-by');
    });

    test('debe manejar CORS correctamente', async () => {
      const response = await request(app)
        .options('/api/contact')
        .set('Origin', 'http://localhost:3000')
        .expect(204);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    test('debe aplicar rate limiting por IP', async () => {
      // Mock de rate limiter que falla después del primer request
      let requestCount = 0;
      const rateLimiterMock = require('../../middleware/rateLimiter.js');
      rateLimiterMock.emailRateLimiter = jest.fn((req, res, next) => {
        requestCount++;
        if (requestCount > 5) {
          res.status(429).json({ error: 'Rate limit exceeded' });
        } else {
          next();
        }
      });

      const contactData = createTestContactData();

      // Primeros requests deberían pasar
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/contact')
          .send(contactData)
          .expect(200);
      }

      // El sexto debería fallar
      await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(429);
    });
  });

  describe('Persistencia de estadísticas', () => {
    test('estadísticas deben incrementar con requests exitosos', async () => {
      // Obtener estadísticas iniciales
      const initialStats = await request(app)
        .get('/api/stats')
        .expect(200);

      const initialEmails = initialStats.body.stats.emailsEnviados;

      // Enviar un email
      await request(app)
        .post('/api/contact')
        .send(createTestContactData())
        .expect(200);

      // Verificar que las estadísticas aumentaron
      const updatedStats = await request(app)
        .get('/api/stats')
        .expect(200);

      expect(updatedStats.body.stats.emailsEnviados).toBe(initialEmails + 1);
    });

    test('errores deben incrementar contador de errores', async () => {
      // Mock de EmailJS que falla
      const emailjs = require('@emailjs/nodejs');
      emailjs.send.mockRejectedValueOnce(new Error('EmailJS error'));

      const initialStats = await request(app)
        .get('/api/stats')
        .expect(200);

      const initialErrors = initialStats.body.stats.errores;

      // Intentar enviar email que fallará
      await request(app)
        .post('/api/contact')
        .send(createTestContactData())
        .expect(500);

      // Verificar que los errores aumentaron
      const updatedStats = await request(app)
        .get('/api/stats')
        .expect(200);

      expect(updatedStats.body.stats.errores).toBe(initialErrors + 1);

      // Restaurar mock
      emailjs.send.mockResolvedValue({ status: 200, text: 'Email sent' });
    });
  });

  describe('Flujos de diferentes tipos de usuarios', () => {
    test('estudiante UVG con carrera específica', async () => {
      const estudianteUVG = {
        nombre: 'Ana López',
        email: 'ana.lopez@uvg.edu.gt',
        carrera: 'ing-ciencia-computacion',
        anioEstudio: '4',
        tipoInteres: 'tesis',
        mensaje: 'Quiero hacer mi tesis sobre conservación de microcuencas'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(estudianteUVG)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('profesional externo interesado en financiamiento', async () => {
      const profesionalExterno = {
        nombre: 'Carlos Mendoza',
        email: 'carlos.mendoza@empresa.com',
        telefono: '+502 9876-5432',
        tipoInteres: 'financiamiento',
        mensaje: 'Represento una empresa interesada en apoyar financieramente el proyecto'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(profesionalExterno)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('voluntario para trabajo de campo', async () => {
      const voluntario = {
        nombre: 'Laura Martínez',
        email: 'laura.martinez@gmail.com',
        tipoInteres: 'voluntario-campo',
        mensaje: 'Soy bióloga y quiero participar como voluntaria en las actividades de campo'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(voluntario)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Validación de tipos de datos', () => {
    test('debe validar formato de email', async () => {
      const emailInvalido = {
        nombre: 'Test User',
        email: 'email-invalido',
        mensaje: 'Test'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(emailInvalido)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('debe aceptar diferentes formatos de teléfono', async () => {
      const formatosTelefono = [
        '+502 1234-5678',
        '1234-5678',
        '12345678',
        '+502 1234 5678'
      ];

      for (const telefono of formatosTelefono) {
        const contactData = {
          ...createTestContactData(),
          telefono
        };

        await request(app)
          .post('/api/contact')
          .send(contactData)
          .expect(200);
      }
    });
  });
});