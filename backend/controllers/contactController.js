import EmailService from "../services/emailService.js";
import { HTTP_STATUS, ERROR_CODES } from "../utils/constants.js";
import logger from "../utils/logger.js";
import { isUVGEmail,sanitizeString } from "../utils/helpers.js";

class ContactController {
  constructor() {
    this.emailService = new EmailService();
    this.stats = {
      emailsEnviados: 0,
      ultimoEmail: null,
      inicioServicio: new Date().toISOString(),
      errores: 0
    };
  }

  /**
   * Procesa solicitud de contacto
   */
  async processContact(req, res, next) {
    try {
      const contactData = req.body; // Ya validado por middleware
      
      // Sanitizar datos adicionales
      const sanitizedData = {
        ...contactData,
        nombre: sanitizeString(contactData.nombre),
        mensaje: sanitizeString(contactData.mensaje)
      };

      // Log de inicio de procesamiento
      logger.info('Procesando solicitud de contacto', {
        email: sanitizedData.email,
        nombre: sanitizedData.nombre,
        tipoInteres: sanitizedData.tipoInteres,
        esUVG: isUVGEmail(sanitizedData.email)
      });

      // Procesar envío de emails
      const result = await this.emailService.processContactEmail(sanitizedData);

      // Actualizar estadísticas
      this.updateStats(true, sanitizedData);

      // Respuesta exitosa
      const response = {
        success: true,
        message: 'Email enviado exitosamente',
        data: {
          trackingId: result.mainEmail.trackingId,
          confirmacionEnviada: result.confirmation.success,
          timestamp: result.timestamp
        }
      };

      logger.info('Solicitud de contacto procesada exitosamente', {
        trackingId: result.mainEmail.trackingId,
        confirmacionEnviada: result.confirmation.success
      });

      res.status(HTTP_STATUS.OK).json(response);

    } catch (error) {
      // Actualizar estadísticas
      this.updateStats(false);
      
      // Log detallado SOLO en logs del servidor
      logger.error('Error procesando contacto:', {
        error: error.message,
        stack: error.stack,
        email: req.body?.email,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });

      const cleanError = new Error('Error procesando solicitud de contacto');
      cleanError.name = 'ContactProcessingError';
      cleanError.statusCode = 500;
      
      // Delegar al middleware de manejo de errores
      next(cleanError);
    }
  }

  /**
   * Obtiene estadísticas del servicio
   */
  getStats(req, res) {
    try {
      const uptime = process.uptime();
      const stats = {
        ...this.stats,
        uptime: {
          seconds: Math.floor(uptime),
          formatted: this.formatUptime(uptime)
        },
        tasaExito: this.stats.emailsEnviados > 0 
          ? ((this.stats.emailsEnviados / (this.stats.emailsEnviados + this.stats.errores)) * 100).toFixed(2)
          : 100,
        memoria: process.memoryUsage(),
        version: '1.0.0'
      };

      logger.info('Estadísticas solicitadas', { requestIP: req.ip });
      
      res.json({
        success: true,
        stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error obteniendo estadísticas:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Error obteniendo estadísticas'
      });
    }
  }

  /**
   * Health check del servicio
   */
  healthCheck(req, res) {
    try {
      const health = {
        status: 'ok',
        service: 'Proyecto Microcuenca Email Service',
        version: '1.0.0',
        emailService: 'EmailJS',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        checks: {
          emailjsConfig: this.emailService.isInitialized,
          externalAPIs: 'ok'
        }
      };

      res.json(health);
    } catch (error) {
      logger.error('Error en health check:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        error: 'Health check failed'
      });
    }
  }

  /**
   * Actualiza estadísticas internas
   */
  updateStats(success, contactData = null) {
    if (success) {
      this.stats.emailsEnviados++;
      this.stats.ultimoEmail = {
        timestamp: new Date().toISOString(),
        email: contactData?.email,
        tipoInteres: contactData?.tipoInteres
      };
    } else {
      this.stats.errores++;
    }
  }

  /**
   * Formatea tiempo de uptime
   */
  formatUptime(uptimeSeconds) {
    const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
    const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  }
}

export default ContactController;