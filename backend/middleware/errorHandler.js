import { HTTP_STATUS, ERROR_CODES } from '../utils/constants.js';
import logger from '../utils/logger.js';

/**
 * Middleware para manejo de errores global - VERSIÓN SEGURA
 */
export const errorHandler = (error, req, res, next) => {
  // Log completo del error SOLO en logs del servidor
  logger.error('Error no manejado:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body, // Para debugging
    timestamp: new Date().toISOString()
  });

  // Determinar tipo de error y respuesta apropiada
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR || 'INTERNAL_ERROR';
  let message = 'Error interno del servidor';

  // Manejar tipos específicos de errores
  if (error.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    message = 'Datos de entrada no válidos';
  } else if (error.message?.includes('EmailJS') || error.message?.includes('email')) {
    errorCode = ERROR_CODES.EMAIL_SEND_ERROR || 'EMAIL_ERROR';
    message = 'Error enviando email. Intenta nuevamente.';
  } else if (error.status === 402) {
    statusCode = HTTP_STATUS.TOO_MANY_REQUESTS;
    errorCode = ERROR_CODES.RATE_LIMIT_EXCEEDED;
    message = 'Límite de emails alcanzado. Intenta mañana.';
  } else if (error.status === 403) {
    statusCode = HTTP_STATUS.FORBIDDEN;
    errorCode = 'FORBIDDEN';
    message = 'Acceso denegado.';
  }

  // Respuesta SEGURA - SIN información sensible
  const errorResponse = {
    success: false,
    error: message,
    code: errorCode,
    timestamp: new Date().toISOString()
  };

  // ❌ NUNCA incluir en producción:
  // - error.stack
  // - error.details 
  // - rutas de archivos
  // - variables internas
  // - información del servidor

  // Solo en desarrollo local (opcional y controlado)
  if (process.env.NODE_ENV === 'development' && process.env.SHOW_ERROR_DETAILS === 'true') {
    errorResponse.devInfo = {
      message: error.message,
      // NO incluir stack trace ni en desarrollo para APIs públicas
    };
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware para rutas no encontradas
 */
export const notFoundHandler = (req, res) => {
  logger.warn('Ruta no encontrada:', {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: 'Endpoint no encontrado',
    code: 'NOT_FOUND',
    availableEndpoints: [
      'POST /api/contact',
      'GET /api/health',
      'GET /api/config',
      'GET /api/stats'
    ],
    timestamp: new Date().toISOString()
  });
};

export const sanitizeResponse = (req, res, next) => {
  // Remover headers que podrían exponer información
  res.removeHeader('X-Powered-By');
  
  // Agregar headers de seguridad
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
};

/**
 * Utility para log seguro de errores
 */
export const logSecureError = (error, context = {}) => {
  // Información segura para logs
  const secureLogData = {
    error: error.message,
    errorName: error.name,
    timestamp: new Date().toISOString(),
    ...context
  };

  // Stack trace SOLO en logs del servidor, nunca en respuestas
  if (process.env.NODE_ENV !== 'production') {
    secureLogData.stack = error.stack;
  }

  logger.error('Error seguro:', secureLogData);
};

/**
 * Verifica que la configuración sea segura para producción
 */
export const validateSecurityConfig = () => {
  const warnings = [];

  if (process.env.NODE_ENV === 'production') {
    if (process.env.SHOW_ERROR_DETAILS === 'true') {
      warnings.push('SHOW_ERROR_DETAILS debe ser false en producción');
    }
    
    if (process.env.LOG_LEVEL === 'debug') {
      warnings.push('LOG_LEVEL no debe ser debug en producción');
    }
  }

  if (warnings.length > 0) {
    logger.warn('Advertencias de seguridad:', warnings);
  }

  return warnings.length === 0;
};