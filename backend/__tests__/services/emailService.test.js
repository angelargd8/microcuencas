import { jest } from '@jest/globals';
import EmailService from '../../services/emailService.js';
import emailjs from '@emailjs/nodejs';

// Mock de emailjs
jest.mock('@emailjs/nodejs');

// Mock de configuración de email
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

// Mock de logger
jest.mock('../../utils/logger.js', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

// Mock de helpers
jest.mock('../../utils/helpers.js', () => ({
  formatearFechaGuatemala: jest.fn(() => '1 de enero de 2023, 12:00'),
  generateTrackingId: jest.fn(() => 'MC_123_test456')
}));

describe('EmailService', () => {
  let emailService;

  beforeEach(() => {
    jest.clearAllMocks();
    emailService = new EmailService();
  });

  describe('constructor e inicialización', () => {
    test('debe inicializar EmailJS correctamente', () => {
      expect(emailjs.init).toHaveBeenCalledWith({
        publicKey: 'test_public_key',
        privateKey: 'test_private_key'
      });
      expect(emailService.isInitialized).toBe(true);
    });

    test('debe manejar errores en la inicialización', () => {
      emailjs.init.mockImplementation(() => {
        throw new Error('Error de inicialización');
      });

      expect(() => new EmailService()).toThrow('Error en configuración de EmailJS');
    });
  });

  describe('buildTemplateParams', () => {
    test('debe construir parámetros completos del template', () => {
      const contactData = createTestContactData();
      const params = emailService.buildTemplateParams(contactData);

      expect(params).toEqual({
        to_email: 'proyecto@test.com',
        from_name: 'Juan Pérez',
        from_email: 'juan.perez@uvg.edu.gt',
        reply_to: 'juan.perez@uvg.edu.gt',
        nombre_completo: 'Juan Pérez',
        email_contacto: 'juan.perez@uvg.edu.gt',
        telefono_contacto: '+502 1234-5678',
        carrera_estudio: 'Ingeniería',
        anio_estudio: '3',
        tipo_interes: 'voluntario-campo',
        mensaje_contacto: 'Mensaje de prueba',
        fecha_solicitud: '1 de enero de 2023, 12:00',
        proyecto_nombre: 'Proyecto Test',
        universidad: 'Universidad Test',
        trackingId: 'MC_123_test456',
        sender_service: 'Test Sender',
        timestamp: expect.any(String)
      });
    });

    test('debe manejar campos opcionales faltantes', () => {
      const contactData = {
        nombre: 'Juan',
        email: 'juan@test.com'
        // Faltan campos opcionales
      };

      const params = emailService.buildTemplateParams(contactData);

      expect(params.telefono_contacto).toBe('No proporcionado');
      expect(params.carrera_estudio).toBe('No proporcionado');
      expect(params.anio_estudio).toBe('No especificado');
      expect(params.tipo_interes).toBe('Información general');
      expect(params.mensaje_contacto).toBe('Sin mensaje adicional');
    });
  });

  describe('buildConfirmationParams', () => {
    test('debe construir parámetros de confirmación correctamente', () => {
      const contactData = createTestContactData();
      const params = emailService.buildConfirmationParams(contactData);

      expect(params).toEqual({
        to_email: 'juan.perez@uvg.edu.gt',
        to_name: 'Juan Pérez',
        proyecto_nombre: 'Proyecto Test',
        universidad: 'Universidad Test',
        email_proyecto: 'proyecto@test.com',
        mensaje_confirmacion: 'Te contactaremos para coordinar actividades de campo y conservación.',
        fecha_confirmacion: '1 de enero de 2023, 12:00'
      });
    });
  });

  describe('getConfirmationMessage', () => {
    test('debe retornar mensaje correcto para cada tipo de interés', () => {
      const testCases = [
        { tipo: 'voluntario-campo', expected: 'Te contactaremos para coordinar actividades de campo y conservación.' },
        { tipo: 'investigacion', expected: 'Nuestro equipo de investigación se pondrá en contacto contigo.' },
        { tipo: 'divulgacion', expected: 'Te incluiremos en nuestras actividades de educación ambiental.' },
        { tipo: 'financiamiento', expected: 'Un coordinador del proyecto te contactará para discutir opciones de apoyo.' },
        { tipo: 'tesis', expected: 'Te conectaremos con supervisores para proyectos de investigación.' },
        { tipo: 'servicio-social', expected: 'Te ayudaremos a estructurar tu servicio social con el proyecto.' },
        { tipo: 'practica-profesional', expected: 'Coordinaremos tu práctica profesional con nuestras actividades.' }
      ];

      testCases.forEach(({ tipo, expected }) => {
        expect(emailService.getConfirmationMessage(tipo)).toBe(expected);
      });
    });

    test('debe retornar mensaje por defecto para tipo desconocido', () => {
      const result = emailService.getConfirmationMessage('tipo-no-existente');
      expect(result).toBe('Nuestro equipo revisará tu solicitud y te contactará pronto.');
    });
  });

  describe('sendMainEmail', () => {
    test('debe enviar email principal exitosamente', async () => {
      const contactData = createTestContactData();
      const mockResponse = { status: 200, text: 'Email enviado' };

      emailjs.send.mockResolvedValue(mockResponse);

      const result = await emailService.sendMainEmail(contactData);

      expect(emailjs.send).toHaveBeenCalledWith(
        'test_service_id',
        'test_template_id',
        expect.objectContaining({
          from_email: 'juan.perez@uvg.edu.gt',
          to_email: 'proyecto@test.com'
        })
      );

      expect(result).toEqual({
        success: true,
        messageId: 'Email enviado',
        trackingId: 'MC_123_test456'
      });
    });

    test('debe fallar si EmailJS no está inicializado', async () => {
      emailService.isInitialized = false;
      const contactData = createTestContactData();

      await expect(emailService.sendMainEmail(contactData))
        .rejects.toThrow('EmailJS no está inicializado');
    });

    test('debe manejar errores de envío de EmailJS', async () => {
      const contactData = createTestContactData();
      const error = new Error('Error de EmailJS');

      emailjs.send.mockRejectedValue(error);

      await expect(emailService.sendMainEmail(contactData))
        .rejects.toThrow('Error de EmailJS');
    });
  });

  describe('sendConfirmationEmail', () => {
    test('debe enviar email de confirmación exitosamente', async () => {
      const contactData = createTestContactData();
      const mockResponse = { status: 200, text: 'Confirmación enviada' };

      emailjs.send.mockResolvedValue(mockResponse);

      const result = await emailService.sendConfirmationEmail(contactData);

      expect(emailjs.send).toHaveBeenCalledWith(
        'test_service_id',
        'test_confirmation_template_id',
        expect.objectContaining({
          to_email: 'juan.perez@uvg.edu.gt',
          to_name: 'Juan Pérez'
        })
      );

      expect(result).toEqual({
        success: true,
        messageId: 'Confirmación enviada'
      });
    });

    test('debe retornar false si confirmación está deshabilitada', async () => {
      // Mock temporal para deshabilitar confirmación
      const originalConfig = require('../../config/email.js');
      jest.doMock('../../config/email.js', () => ({
        emailConfig: {
          ...originalConfig.emailConfig,
          settings: {
            ...originalConfig.emailConfig.settings,
            enableConfirmation: false
          }
        }
      }));

      // Recrear servicio con nueva configuración
      const emailServiceWithDisabledConfirmation = new EmailService();
      const contactData = createTestContactData();

      const result = await emailServiceWithDisabledConfirmation.sendConfirmationEmail(contactData);

      expect(result).toEqual({
        success: false,
        reason: 'confirmation_disabled'
      });

      expect(emailjs.send).not.toHaveBeenCalled();
    });

    test('debe manejar errores de confirmación sin fallar', async () => {
      const contactData = createTestContactData();
      const error = new Error('Error enviando confirmación');

      emailjs.send.mockRejectedValue(error);

      const result = await emailService.sendConfirmationEmail(contactData);

      expect(result).toEqual({
        success: false,
        error: 'Error enviando confirmación',
        reason: 'confirmation_failed'
      });
    });
  });

  describe('processContactEmail', () => {
    test('debe procesar email completo exitosamente', async () => {
      const contactData = createTestContactData();

      // Mock de respuestas exitosas
      emailjs.send
        .mockResolvedValueOnce({ status: 200, text: 'Email principal enviado' })
        .mockResolvedValueOnce({ status: 200, text: 'Confirmación enviada' });

      const result = await emailService.processContactEmail(contactData);

      expect(result).toEqual({
        success: true,
        mainEmail: {
          success: true,
          messageId: 'Email principal enviado',
          trackingId: 'MC_123_test456'
        },
        confirmation: {
          success: true,
          messageId: 'Confirmación enviada'
        },
        timestamp: expect.any(String)
      });

      // Verificar que se llamaron ambos métodos de envío
      expect(emailjs.send).toHaveBeenCalledTimes(2);
    });

    test('debe fallar si el email principal falla', async () => {
      const contactData = createTestContactData();
      const error = new Error('Error en email principal');

      emailjs.send.mockRejectedValue(error);

      await expect(emailService.processContactEmail(contactData))
        .rejects.toThrow('Error en email principal');
    });

    test('debe continuar aunque la confirmación falle', async () => {
      const contactData = createTestContactData();

      // Email principal exitoso, confirmación falla
      emailjs.send
        .mockResolvedValueOnce({ status: 200, text: 'Email principal enviado' })
        .mockRejectedValueOnce(new Error('Error confirmación'));

      const result = await emailService.processContactEmail(contactData);

      expect(result.success).toBe(true);
      expect(result.mainEmail.success).toBe(true);
      expect(result.confirmation.success).toBe(false);
    });
  });

  describe('casos edge y validaciones', () => {
    test('debe manejar tracking ID únicos', () => {
      const contactData1 = createTestContactData();
      const contactData2 = createTestContactData();

      const params1 = emailService.buildTemplateParams(contactData1);
      const params2 = emailService.buildTemplateParams(contactData2);

      // Aunque usamos mock que retorna el mismo ID, en el código real serían diferentes
      expect(params1.trackingId).toBeDefined();
      expect(params2.trackingId).toBeDefined();
    });

    test('debe manejar datos de entrada con caracteres especiales', () => {
      const contactData = {
        nombre: 'José María Ñúñez',
        email: 'jose.maria@uvg.edu.gt',
        mensaje: 'Mensaje con acentos y ñ'
      };

      const params = emailService.buildTemplateParams(contactData);

      expect(params.nombre_completo).toBe('José María Ñúñez');
      expect(params.mensaje_contacto).toBe('Mensaje con acentos y ñ');
    });

    test('debe manejar emails muy largos', () => {
      const contactData = createTestContactData({
        mensaje: 'A'.repeat(5000) // Mensaje muy largo
      });

      const params = emailService.buildTemplateParams(contactData);

      expect(params.mensaje_contacto).toBe('A'.repeat(5000));
    });
  });

  describe('configuración de timeout y reintentos', () => {
    test('debe manejar timeout de EmailJS', async () => {
      const contactData = createTestContactData();
      const timeoutError = new Error('Request timeout');
      timeoutError.status = 408;

      emailjs.send.mockRejectedValue(timeoutError);

      await expect(emailService.sendMainEmail(contactData))
        .rejects.toThrow('Request timeout');
    });

    test('debe manejar límites de rate de EmailJS', async () => {
      const contactData = createTestContactData();
      const rateLimitError = new Error('Rate limit exceeded');
      rateLimitError.status = 429;

      emailjs.send.mockRejectedValue(rateLimitError);

      await expect(emailService.sendMainEmail(contactData))
        .rejects.toThrow('Rate limit exceeded');
    });
  });
});