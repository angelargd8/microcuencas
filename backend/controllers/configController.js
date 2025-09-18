import { CARRERAS_UVG, TIPOS_INTERES } from "../utils/constants.js";
import { emailConfig } from "../config/email.js";
import logger from "../utils/logger.js";

class ConfigController {
  /**
   * Obtiene configuración pública para el frontend
   */
  static getPublicConfig(req, res) {
    try {
      const config = {
        project: {
          name: emailConfig.project.name,
          email: emailConfig.project.email, // Es público
          university: emailConfig.project.university
        },
        options: {
          carreras: CARRERAS_UVG,
          tiposInteres: TIPOS_INTERES
        },
        settings: {
          maxMessageLength: emailConfig.settings.maxMessageLength,
          enableConfirmation: emailConfig.settings.enableConfirmation
        },
        validation: {
          phonePattern: '^(\\+502\\s?)?[2-9]\\d{3}[-\\s]?\\d{4}',
          phoneExample: '2234-5678 o +502 2234-5678'
        }
      };

      logger.info('Configuración pública solicitada', { 
        requestIP: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({
        success: true,
        config,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error obteniendo configuración:', error);
      res.status(500).json({
        success: false,
        error: 'Error obteniendo configuración'
      });
    }
  }
}

export default ConfigController;