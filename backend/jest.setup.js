// Jest setup file para configuración global de tests
import { jest } from '@jest/globals';

// Mock de variables de entorno
process.env.NODE_ENV = 'test';
process.env.EMAIL_PUBLIC_KEY = 'test_public_key';
process.env.EMAIL_PRIVATE_KEY = 'test_private_key';
process.env.EMAIL_SERVICE_ID = 'test_service_id';
process.env.EMAIL_TEMPLATE_ID = 'test_template_id';
process.env.EMAIL_CONFIRMATION_TEMPLATE_ID = 'test_confirmation_template_id';
process.env.PROJECT_EMAIL = 'test@proyecto.com';
process.env.LOG_LEVEL = 'error'; // Silenciar logs durante tests

// Mock global de EmailJS
global.mockEmailjs = {
  init: jest.fn(),
  send: jest.fn()
};

// Mock de logger para evitar logs durante tests
global.mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
};

// Helper para crear datos de contacto de prueba
global.createTestContactData = (overrides = {}) => ({
  nombre: 'Juan Pérez',
  email: 'juan.perez@uvg.edu.gt',
  telefono: '+502 1234-5678',
  carrera: 'Ingeniería',
  anioEstudio: '3',
  tipoInteres: 'voluntario-campo',
  mensaje: 'Mensaje de prueba',
  ...overrides
});

// Helper para crear request mock
global.createMockRequest = (body = {}, headers = {}) => ({
  body,
  headers,
  get: jest.fn((header) => headers[header]),
  ip: '127.0.0.1',
  url: '/api/test',
  method: 'POST'
});

// Helper para crear response mock
global.createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    removeHeader: jest.fn().mockReturnThis()
  };
  return res;
};

// Helper para crear next function mock
global.createMockNext = () => jest.fn();

// Timeout extendido para tests que involucran I/O
jest.setTimeout(10000);

// Limpiar todos los mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

// Configuración global para fetch (si se usa)
global.fetch = jest.fn();