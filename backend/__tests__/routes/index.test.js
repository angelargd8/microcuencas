import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import router from '../../routes/index.js';
import ContactController from '../../controllers/contactController.js';
import ConfigController from '../../controllers/configController.js';

// Mock de los controladores
jest.mock('../../controllers/contactController.js');
jest.mock('../../controllers/configController.js');

// Mock de las rutas de contacto
jest.mock('../../routes/contact.js', () => {
  const express = require('express');
  const contactRouter = express.Router();

  contactRouter.post('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Contacto procesado' });
  });

  contactRouter.get('/stats', (req, res) => {
    res.json({ success: true, stats: {} });
  });

  return contactRouter;
});

describe('Routes - Index', () => {
  let app;
  let mockContactController;
  let mockConfigController;

  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar mocks de controladores
    mockContactController = {
      healthCheck: jest.fn((req, res) => {
        res.json({ status: 'ok' });
      }),
      getStats: jest.fn((req, res) => {
        res.json({ success: true, stats: {} });
      })
    };

    mockConfigController = {
      getPublicConfig: jest.fn((req, res) => {
        res.json({ config: 'test' });
      })
    };

    // Mock de constructores
    ContactController.mockImplementation(() => mockContactController);
    ConfigController.getPublicConfig = mockConfigController.getPublicConfig;

    // Configurar aplicación Express para testing
    app = express();
    app.use(express.json());
    app.use('/api', router);
  });

  describe('GET /api/', () => {
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

    test('debe incluir timestamp válido', async () => {
      const response = await request(app)
        .get('/api/')
        .expect(200);

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(isNaN(timestamp.getTime())).toBe(false);
    });
  });

  describe('GET /api/config', () => {
    test('debe llamar al ConfigController.getPublicConfig', async () => {
      await request(app)
        .get('/api/config')
        .expect(200);

      expect(ConfigController.getPublicConfig).toHaveBeenCalledTimes(1);
    });

    test('debe retornar configuración pública', async () => {
      const response = await request(app)
        .get('/api/config')
        .expect(200);

      expect(response.body).toEqual({ config: 'test' });
    });
  });

  describe('GET /api/health', () => {
    test('debe llamar al health check del ContactController', async () => {
      await request(app)
        .get('/api/health')
        .expect(200);

      expect(mockContactController.healthCheck).toHaveBeenCalledTimes(1);
    });

    test('debe retornar status ok', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });

    test('debe pasar request y response correctos', async () => {
      await request(app)
        .get('/api/health')
        .expect(200);

      const [req, res] = mockContactController.healthCheck.mock.calls[0];
      expect(req).toBeDefined();
      expect(res).toBeDefined();
      expect(req.url).toBe('/health');
      expect(req.method).toBe('GET');
    });
  });

  describe('GET /api/stats', () => {
    test('debe llamar al getStats del ContactController', async () => {
      await request(app)
        .get('/api/stats')
        .expect(200);

      expect(mockContactController.getStats).toHaveBeenCalledTimes(1);
    });

    test('debe retornar estadísticas', async () => {
      const response = await request(app)
        .get('/api/stats')
        .expect(200);

      expect(response.body).toEqual({ success: true, stats: {} });
    });
  });

  describe('Rutas de contacto (/api/contact/*)', () => {
    test('debe delegar a las rutas de contacto', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send(createTestContactData())
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Contacto procesado'
      });
    });

    test('debe acceder a estadísticas específicas de contacto', async () => {
      const response = await request(app)
        .get('/api/contact/stats')
        .expect(200);

      expect(response.body).toEqual({ success: true, stats: {} });
    });
  });

  describe('Manejo de errores y casos edge', () => {
    test('debe manejar errores en health check', async () => {
      mockContactController.healthCheck.mockImplementation((req, res) => {
        throw new Error('Error en health check');
      });

      // La aplicación debería manejar el error sin crash
      await request(app)
        .get('/api/health')
        .expect(500);
    });

    test('debe manejar errores en getStats', async () => {
      mockContactController.getStats.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Error interno' });
      });

      const response = await request(app)
        .get('/api/stats')
        .expect(500);

      expect(response.body).toEqual({ error: 'Error interno' });
    });

    test('debe manejar errores en configuración', async () => {
      ConfigController.getPublicConfig.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Error de configuración' });
      });

      const response = await request(app)
        .get('/api/config')
        .expect(500);

      expect(response.body).toEqual({ error: 'Error de configuración' });
    });
  });

  describe('Validación de estructura de endpoints', () => {
    test('todos los endpoints definidos deben ser accesibles', async () => {
      const infoResponse = await request(app)
        .get('/api/')
        .expect(200);

      const endpoints = infoResponse.body.endpoints;

      // Verificar que cada endpoint funciona
      await request(app).get('/api/config').expect(200);
      await request(app).get('/api/health').expect(200);
      await request(app).get('/api/stats').expect(200);

      // El endpoint de contacto es POST, requiere datos
      await request(app)
        .post('/api/contact')
        .send(createTestContactData())
        .expect(200);
    });

    test('debe mantener consistencia en formato de respuestas', async () => {
      const endpoints = [
        { method: 'get', path: '/api/' },
        { method: 'get', path: '/api/config' },
        { method: 'get', path: '/api/health' },
        { method: 'get', path: '/api/stats' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(typeof response.body).toBe('object');
      }
    });
  });

  describe('Headers y metadatos', () => {
    test('debe retornar content-type JSON para todos los endpoints', async () => {
      const endpoints = ['/api/', '/api/config', '/api/health', '/api/stats'];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);
        expect(response.headers['content-type']).toMatch(/application\/json/);
      }
    });

    test('debe manejar requests con diferentes User-Agent', async () => {
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'curl/7.68.0',
        'PostmanRuntime/7.28.0'
      ];

      for (const userAgent of userAgents) {
        await request(app)
          .get('/api/health')
          .set('User-Agent', userAgent)
          .expect(200);
      }
    });
  });

  describe('Instanciación de controladores', () => {
    test('debe crear una única instancia de ContactController', () => {
      expect(ContactController).toHaveBeenCalledTimes(1);
      expect(ContactController).toHaveBeenCalledWith();
    });

    test('debe usar métodos estáticos de ConfigController', async () => {
      await request(app).get('/api/config');

      // ConfigController.getPublicConfig debe ser estático
      expect(typeof ConfigController.getPublicConfig).toBe('function');
    });
  });
});