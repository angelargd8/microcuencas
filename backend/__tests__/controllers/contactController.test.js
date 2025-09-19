import { jest } from '@jest/globals';
import ContactController from '../../controllers/contactController.js';
import EmailService from '../../services/emailService.js';
import { HTTP_STATUS, ERROR_CODES } from '../../utils/constants.js';

// Mock de EmailService
jest.mock('../../services/emailService.js');

// Mock de logger
jest.mock('../../utils/logger.js', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

// Mock de helpers
jest.mock('../../utils/helpers.js', () => ({
  isUVGEmail: jest.fn((email) => email.includes('@uvg.edu.gt')),
  sanitizeString: jest.fn((str) => str)
}));

describe('ContactController', () => {
  let contactController;
  let mockEmailService;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Crear nueva instancia del controller
    contactController = new ContactController();
    mockEmailService = contactController.emailService;

    // Mock de métodos del EmailService
    mockEmailService.processContactEmail = jest.fn();
    mockEmailService.isInitialized = true;
  });

  describe('constructor', () => {
    test('debe inicializar correctamente las estadísticas', () => {
      expect(contactController.stats).toEqual({
        emailsEnviados: 0,
        ultimoEmail: null,
        inicioServicio: expect.any(String),
        errores: 0
      });
    });

    test('debe crear una instancia de EmailService', () => {
      expect(contactController.emailService).toBeInstanceOf(EmailService);
    });
  });

  describe('processContact', () => {
    let req, res, next;

    beforeEach(() => {
      req = createMockRequest(createTestContactData());
      res = createMockResponse();
      next = createMockNext();
    });

    test('debe procesar correctamente una solicitud válida', async () => {
      // Mock respuesta exitosa del EmailService
      const mockResult = {
        mainEmail: { trackingId: 'MC_123_abc' },
        confirmation: { success: true },
        timestamp: '2023-01-01T00:00:00.000Z'
      };
      mockEmailService.processContactEmail.mockResolvedValue(mockResult);

      await contactController.processContact(req, res, next);

      expect(mockEmailService.processContactEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: 'Juan Pérez',
          email: 'juan.perez@uvg.edu.gt'
        })
      );

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Email enviado exitosamente',
        data: {
          trackingId: 'MC_123_abc',
          confirmacionEnviada: true,
          timestamp: '2023-01-01T00:00:00.000Z'
        }
      });

      expect(contactController.stats.emailsEnviados).toBe(1);
      expect(contactController.stats.ultimoEmail).toEqual({
        timestamp: expect.any(String),
        email: 'juan.perez@uvg.edu.gt',
        tipoInteres: 'voluntario-campo'
      });
    });

    test('debe manejar errores del EmailService', async () => {
      const error = new Error('Error enviando email');
      mockEmailService.processContactEmail.mockRejectedValue(error);

      await contactController.processContact(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Error procesando solicitud de contacto',
        name: 'ContactProcessingError',
        statusCode: 500
      }));

      expect(contactController.stats.errores).toBe(1);
      expect(contactController.stats.emailsEnviados).toBe(0);
    });

    test('debe sanitizar los datos de entrada', async () => {
      req.body = {
        ...createTestContactData(),
        nombre: '<script>alert("hack")</script>Nombre',
        mensaje: 'Mensaje con <script>código</script>'
      };

      const mockResult = {
        mainEmail: { trackingId: 'MC_123_abc' },
        confirmation: { success: true },
        timestamp: '2023-01-01T00:00:00.000Z'
      };
      mockEmailService.processContactEmail.mockResolvedValue(mockResult);

      await contactController.processContact(req, res, next);

      expect(mockEmailService.processContactEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: expect.any(String),
          mensaje: expect.any(String)
        })
      );
    });

    test('debe manejar datos faltantes sin fallar', async () => {
      req.body = {
        nombre: 'Juan',
        email: 'juan@test.com'
        // Faltan otros campos
      };

      const mockResult = {
        mainEmail: { trackingId: 'MC_123_abc' },
        confirmation: { success: true },
        timestamp: '2023-01-01T00:00:00.000Z'
      };
      mockEmailService.processContactEmail.mockResolvedValue(mockResult);

      await contactController.processContact(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });
  });

  describe('getStats', () => {
    let req, res;

    beforeEach(() => {
      req = createMockRequest();
      res = createMockResponse();
    });

    test('debe retornar estadísticas correctas', () => {
      // Simular algunas estadísticas
      contactController.stats.emailsEnviados = 10;
      contactController.stats.errores = 2;

      contactController.getStats(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        stats: expect.objectContaining({
          emailsEnviados: 10,
          errores: 2,
          uptime: expect.objectContaining({
            seconds: expect.any(Number),
            formatted: expect.any(String)
          }),
          tasaExito: '83.33',
          memoria: expect.any(Object),
          version: '1.0.0'
        }),
        timestamp: expect.any(String)
      });
    });

    test('debe calcular tasa de éxito correctamente con cero emails', () => {
      contactController.stats.emailsEnviados = 0;
      contactController.stats.errores = 0;

      contactController.getStats(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stats: expect.objectContaining({
            tasaExito: '100'
          })
        })
      );
    });

    test('debe manejar errores al obtener estadísticas', () => {
      // Simular error en process.uptime
      const originalUptime = process.uptime;
      process.uptime = jest.fn(() => {
        throw new Error('Error uptime');
      });

      contactController.getStats(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error obteniendo estadísticas'
      });

      // Restaurar función original
      process.uptime = originalUptime;
    });
  });

  describe('healthCheck', () => {
    let req, res;

    beforeEach(() => {
      req = createMockRequest();
      res = createMockResponse();
    });

    test('debe retornar health check exitoso', () => {
      contactController.healthCheck(req, res);

      expect(res.json).toHaveBeenCalledWith({
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

    test('debe manejar errores en health check', () => {
      // Simular error en process.uptime
      const originalUptime = process.uptime;
      process.uptime = jest.fn(() => {
        throw new Error('Error uptime');
      });

      contactController.healthCheck(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        error: 'Health check failed'
      });

      // Restaurar función original
      process.uptime = originalUptime;
    });
  });

  describe('updateStats', () => {
    test('debe actualizar estadísticas en caso exitoso', () => {
      const contactData = createTestContactData();

      contactController.updateStats(true, contactData);

      expect(contactController.stats.emailsEnviados).toBe(1);
      expect(contactController.stats.ultimoEmail).toEqual({
        timestamp: expect.any(String),
        email: contactData.email,
        tipoInteres: contactData.tipoInteres
      });
    });

    test('debe actualizar estadísticas en caso de error', () => {
      contactController.updateStats(false);

      expect(contactController.stats.errores).toBe(1);
      expect(contactController.stats.emailsEnviados).toBe(0);
      expect(contactController.stats.ultimoEmail).toBeNull();
    });

    test('debe funcionar sin contactData', () => {
      contactController.updateStats(true);

      expect(contactController.stats.emailsEnviados).toBe(1);
      expect(contactController.stats.ultimoEmail).toEqual({
        timestamp: expect.any(String),
        email: undefined,
        tipoInteres: undefined
      });
    });
  });

  describe('formatUptime', () => {
    test('debe formatear uptime correctamente', () => {
      // 1 día, 2 horas, 30 minutos = 94200 segundos
      const uptime = 24 * 60 * 60 + 2 * 60 * 60 + 30 * 60;
      const formatted = contactController.formatUptime(uptime);

      expect(formatted).toBe('1d 2h 30m');
    });

    test('debe manejar uptime menor a un día', () => {
      // 2 horas, 15 minutos = 8100 segundos
      const uptime = 2 * 60 * 60 + 15 * 60;
      const formatted = contactController.formatUptime(uptime);

      expect(formatted).toBe('0d 2h 15m');
    });

    test('debe manejar uptime menor a una hora', () => {
      // 45 minutos = 2700 segundos
      const uptime = 45 * 60;
      const formatted = contactController.formatUptime(uptime);

      expect(formatted).toBe('0d 0h 45m');
    });

    test('debe manejar uptime de cero', () => {
      const formatted = contactController.formatUptime(0);

      expect(formatted).toBe('0d 0h 0m');
    });
  });

  describe('integración con tipos de email UVG vs externos', () => {
    let req, res, next;

    beforeEach(() => {
      req = createMockRequest();
      res = createMockResponse();
      next = createMockNext();
    });

    test('debe manejar email UVG correctamente', async () => {
      req.body = createTestContactData({
        email: 'estudiante@uvg.edu.gt'
      });

      const mockResult = {
        mainEmail: { trackingId: 'MC_123_abc' },
        confirmation: { success: true },
        timestamp: '2023-01-01T00:00:00.000Z'
      };
      mockEmailService.processContactEmail.mockResolvedValue(mockResult);

      await contactController.processContact(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });

    test('debe manejar email externo correctamente', async () => {
      req.body = createTestContactData({
        email: 'externo@gmail.com'
      });

      const mockResult = {
        mainEmail: { trackingId: 'MC_123_abc' },
        confirmation: { success: true },
        timestamp: '2023-01-01T00:00:00.000Z'
      };
      mockEmailService.processContactEmail.mockResolvedValue(mockResult);

      await contactController.processContact(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });
  });
});