import { ValidationService,ValidationError } from '../services/validationService.js';
import { HTTP_STATUS, ERROR_CODES } from '../utils/constants.js';
import logger from '../utils/logger.js';

/**
 * Middleware para validar datos de contacto
 */
const validateContactData = (req, res, next) => {
  try {
    // Validar y sanitizar datos
    const validatedData = ValidationService.validateContactData(req.body);
    
    // Reemplazar req.body con datos validados y sanitizados
    req.body = validatedData;
    
    logger.info('Datos de contacto validados exitosamente', {
      email: validatedData.email,
      tipoInteres: validatedData.tipoInteres
    });
    
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.warn('Error de validación:', {
        errors: error.errors,
        originalData: req.body
      });
      
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Datos de entrada no válidos',
        code: ERROR_CODES.VALIDATION_ERROR,
        details: error.errors,
        timestamp: new Date().toISOString()
      });
    }
    
    // Error inesperado
    logger.error('Error inesperado en validación:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Error interno de validación',
      code: ERROR_CODES.VALIDATION_ERROR,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Middleware para logging de requests
 */
const logRequest = (req, res, next) => {
  const startTime = Date.now();
  
  // Log del request entrante
  logger.info('Request recibido', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type')
  });
  
  // Interceptar response para logging
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    logger.info('Response enviado', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: data ? data.length : 0
    });
    
    originalSend.call(this, data);
  };
  
  next();
};

export { validateContactData, logRequest };