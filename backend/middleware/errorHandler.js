import { HTTP_STATUS, ERROR_CODES } from "../utils/constants.js";
import logger from "../utils/logger.js";

/**
 * Middleware para manejo de errores global
 */
const errorHandler = (error, req, res, next) => {
  // Log del error completo
  logger.error('Error no manejado:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Determinar tipo de error y respuesta apropiada
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
  let message = 'Error interno del servidor';

  // Manejar tipos específicos de errores
  if (error.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    message = 'Datos de entrada no válidos';
  } else if (error.message?.includes('EmailJS') || error.message?.includes('email')) {
    errorCode = ERROR_CODES.EMAIL_SEND_ERROR;
    message = 'Error enviando email. Intenta nuevamente.';
  } else if (error.status === 402) {
    statusCode = HTTP_STATUS.TOO_MANY_REQUESTS;
    errorCode = ERROR_CODES.RATE_LIMIT_EXCEEDED;
    message = 'Límite de emails alcanzado. Intenta mañana.';
  }

  // No exponer detalles internos en producción
  const errorResponse = {
    success: false,
    error: message,
    code: errorCode,
    timestamp: new Date().toISOString()
  };

  // En desarrollo, incluir stack trace
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = error.stack;
    errorResponse.details = error.message;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware para rutas no encontradas
 */
const notFoundHandler = (req, res) => {
  logger.warn('Ruta no encontrada:', {
    url: req.url,
    method: req.method,
    ip: req.ip
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

export { errorHandler, notFoundHandler };