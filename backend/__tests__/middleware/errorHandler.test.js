import { jest } from '@jest/globals';
import {
  errorHandler,
  notFoundHandler,
  sanitizeResponse,
  logSecureError,
  validateSecurityConfig
} from '../../middleware/errorHandler.js';
import { HTTP_STATUS, ERROR_CODES } from '../../utils/constants.js';

// Mock de logger
jest.mock('../../utils/logger.js', () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
}));

describe('ErrorHandler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  describe('errorHandler', () => {
    test('debe manejar error genérico correctamente', () => {
      const error = new Error('Error genérico');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
        timestamp: expect.any(String)
      });
    });

    test('debe manejar ValidationError correctamente', () => {
      const error = new Error('Datos inválidos');
      error.name = 'ValidationError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Datos de entrada no válidos',
        code: ERROR_CODES.VALIDATION_ERROR,
        timestamp: expect.any(String)
      });
    });

    test('debe manejar errores de email', () => {
      const error = new Error('Error con EmailJS');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error enviando email. Intenta nuevamente.',
        code: 'EMAIL_ERROR',
        timestamp: expect.any(String)
      });
    });

    test('debe manejar error de rate limit (status 402)', () => {
      const error = new Error('Rate limit');
      error.status = 402;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.TOO_MANY_REQUESTS);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Límite de emails alcanzado. Intenta mañana.',
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        timestamp: expect.any(String)
      });
    });

    test('debe manejar error 403 Forbidden', () => {
      const error = new Error('Forbidden');
      error.status = 403;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Acceso denegado.',
        code: 'FORBIDDEN',
        timestamp: expect.any(String)
      });
    });

    test('debe incluir información de desarrollo si está habilitada', () => {
      const originalEnv = process.env.NODE_ENV;
      const originalShowErrors = process.env.SHOW_ERROR_DETAILS;

      process.env.NODE_ENV = 'development';
      process.env.SHOW_ERROR_DETAILS = 'true';

      const error = new Error('Error de desarrollo');

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          devInfo: {
            message: 'Error de desarrollo'
          }
        })
      );

      // Restaurar variables de entorno
      process.env.NODE_ENV = originalEnv;
      process.env.SHOW_ERROR_DETAILS = originalShowErrors;
    });

    test('NO debe incluir información sensible en producción', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Error sensible');
      error.stack = 'Stack trace sensible';

      errorHandler(error, req, res, next);

      const responseCall = res.json.mock.calls[0][0];
      expect(responseCall).not.toHaveProperty('stack');
      expect(responseCall).not.toHaveProperty('devInfo');
      expect(responseCall.error).toBe('Error interno del servidor');

      process.env.NODE_ENV = originalEnv;
    });

    test('debe loggear información completa del error', () => {
      const logger = require('../../utils/logger.js');
      const error = new Error('Error para logging');
      error.stack = 'Stack trace completo';

      req.url = '/api/test';
      req.method = 'POST';
      req.body = { test: 'data' };

      errorHandler(error, req, res, next);

      expect(logger.error).toHaveBeenCalledWith('Error no manejado:', {
        error: 'Error para logging',
        stack: 'Stack trace completo',
        url: '/api/test',
        method: 'POST',
        ip: '127.0.0.1',
        userAgent: undefined,
        body: { test: 'data' },
        timestamp: expect.any(String)
      });
    });
  });

  describe('notFoundHandler', () => {
    test('debe manejar rutas no encontradas', () => {
      req.url = '/api/ruta-inexistente';
      req.method = 'GET';

      notFoundHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
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

    test('debe loggear rutas no encontradas', () => {
      const logger = require('../../utils/logger.js');

      req.url = '/api/inexistente';
      req.method = 'POST';
      req.ip = '192.168.1.1';

      notFoundHandler(req, res);

      expect(logger.warn).toHaveBeenCalledWith('Ruta no encontrada:', {
        url: '/api/inexistente',
        method: 'POST',
        ip: '192.168.1.1',
        userAgent: undefined
      });
    });
  });

  describe('sanitizeResponse', () => {
    test('debe remover headers peligrosos y agregar headers de seguridad', () => {
      sanitizeResponse(req, res, next);

      expect(res.removeHeader).toHaveBeenCalledWith('X-Powered-By');
      expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
      expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
      expect(res.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('logSecureError', () => {
    test('debe loggear error de forma segura', () => {
      const logger = require('../../utils/logger.js');
      const error = new Error('Error de prueba');
      const context = { userId: '123', action: 'test' };

      logSecureError(error, context);

      expect(logger.error).toHaveBeenCalledWith('Error seguro:', {
        error: 'Error de prueba',
        errorName: 'Error',
        timestamp: expect.any(String),
        userId: '123',
        action: 'test'
      });
    });

    test('debe incluir stack trace en desarrollo', () => {
      const logger = require('../../utils/logger.js');
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Error de desarrollo');
      error.stack = 'Stack trace';

      logSecureError(error);

      expect(logger.error).toHaveBeenCalledWith('Error seguro:',
        expect.objectContaining({
          stack: 'Stack trace'
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    test('NO debe incluir stack trace en producción', () => {
      const logger = require('../../utils/logger.js');
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Error de producción');
      error.stack = 'Stack trace sensible';

      logSecureError(error);

      const logCall = logger.error.mock.calls[0][1];
      expect(logCall).not.toHaveProperty('stack');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('validateSecurityConfig', () => {
    test('debe pasar validación con configuración segura', () => {
      const originalEnv = process.env.NODE_ENV;
      const originalShowErrors = process.env.SHOW_ERROR_DETAILS;
      const originalLogLevel = process.env.LOG_LEVEL;

      process.env.NODE_ENV = 'production';
      process.env.SHOW_ERROR_DETAILS = 'false';
      process.env.LOG_LEVEL = 'info';

      const result = validateSecurityConfig();

      expect(result).toBe(true);

      // Restaurar variables
      process.env.NODE_ENV = originalEnv;
      process.env.SHOW_ERROR_DETAILS = originalShowErrors;
      process.env.LOG_LEVEL = originalLogLevel;
    });

    test('debe detectar configuración insegura en producción', () => {
      const logger = require('../../utils/logger.js');
      const originalEnv = process.env.NODE_ENV;
      const originalShowErrors = process.env.SHOW_ERROR_DETAILS;
      const originalLogLevel = process.env.LOG_LEVEL;

      process.env.NODE_ENV = 'production';
      process.env.SHOW_ERROR_DETAILS = 'true';
      process.env.LOG_LEVEL = 'debug';

      const result = validateSecurityConfig();

      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith('Advertencias de seguridad:', [
        'SHOW_ERROR_DETAILS debe ser false en producción',
        'LOG_LEVEL no debe ser debug en producción'
      ]);

      // Restaurar variables
      process.env.NODE_ENV = originalEnv;
      process.env.SHOW_ERROR_DETAILS = originalShowErrors;
      process.env.LOG_LEVEL = originalLogLevel;
    });

    test('debe permitir configuración de desarrollo en entorno de desarrollo', () => {
      const originalEnv = process.env.NODE_ENV;
      const originalShowErrors = process.env.SHOW_ERROR_DETAILS;
      const originalLogLevel = process.env.LOG_LEVEL;

      process.env.NODE_ENV = 'development';
      process.env.SHOW_ERROR_DETAILS = 'true';
      process.env.LOG_LEVEL = 'debug';

      const result = validateSecurityConfig();

      expect(result).toBe(true);

      // Restaurar variables
      process.env.NODE_ENV = originalEnv;
      process.env.SHOW_ERROR_DETAILS = originalShowErrors;
      process.env.LOG_LEVEL = originalLogLevel;
    });
  });

  describe('casos edge y manejo de errores complejos', () => {
    test('debe manejar errores sin mensaje', () => {
      const error = new Error();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Error interno del servidor'
        })
      );
    });

    test('debe manejar errores con propiedades personalizadas', () => {
      const error = new Error('Error personalizado');
      error.statusCode = 422;
      error.customProperty = 'valor';

      errorHandler(error, req, res, next);

      // No debe exponer propiedades personalizadas
      const responseCall = res.json.mock.calls[0][0];
      expect(responseCall).not.toHaveProperty('customProperty');
    });

    test('debe manejar múltiples tipos de errores de email', () => {
      const testCases = [
        'Error enviando email',
        'EmailJS configuration error',
        'email service unavailable'
      ];

      testCases.forEach(message => {
        jest.clearAllMocks();
        const error = new Error(message);

        errorHandler(error, req, res, next);

        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: 'Error enviando email. Intenta nuevamente.',
            code: 'EMAIL_ERROR'
          })
        );
      });
    });

    test('debe manejar errores sin request completo', () => {
      const incompleteReq = {
        url: '/test',
        method: 'GET'
        // Faltan otras propiedades
      };

      const error = new Error('Error con request incompleto');

      expect(() => {
        errorHandler(error, incompleteReq, res, next);
      }).not.toThrow();

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
  });
});