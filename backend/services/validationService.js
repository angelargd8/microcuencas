import Joi from "joi";

import { CARRERAS_UVG, TIPOS_INTERES } from "../utils/constants.js"; 

const contactSchema = Joi.object({
    nombre: Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/)
        .required()
        .messages({
            'string.min': 'El nombre debe tener al menos 2 caracteres.',
            'string.max': 'El nombre no debe exceder los 100 caracteres.',
            'string.pattern.base': 'El nombre solo puede contener letras y espacios.',
            'any.required': 'El nombre es obligatorio.'
        }),

    email: Joi.string()
        .email()
        .max(255)
        .required()
        .messages({
            'string.email': 'El correo electrónico no es válido.',
            'string.max': 'El correo electrónico no debe exceder los 255 caracteres.',
            'any.required': 'El correo electrónico es obligatorio.'
        }),

    telefono: Joi.string()
        .pattern(/^(\+502\s?)?[2-9]\d{3}[-\s]?\d{4}$/)
        .optional()
        .allow('')
        .messages({
        'string.pattern.base': 'Formato de teléfono guatemalteco no válido. Ejemplo: 2234-5678 o +502 2234-5678'
        }),

    carrera: Joi.string()
        .valid(...CARRERAS_UVG.map(c => c.value))
        .optional(),

    tipoInteres: Joi.string()
        .valid(...TIPOS_INTERES.map(t => t.value))
        .optional(),

    mensaje: Joi.string()
        .max(500)
        .optional()
        .allow('')
        .messages({
        'string.max': 'El mensaje no puede exceder 500 caracteres'
        }),

    anioEstudio: Joi.string()
        .valid('1', '2', '3', '4', '5', 'graduado', 'maestria', 'doctorado', 'otro')
        .optional(),

    enviarConfirmacion: Joi.boolean()
        .optional()
        .default(true)
});

class ValidationService {
  /**
   * Valida datos de contacto
   */
  static validateContactData(data) {
    const { error, value } = contactSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      throw new ValidationError('Datos de entrada no válidos', errors);
    }

    return value;
  }

  /**
   * Valida email específicamente
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida teléfono guatemalteco
   */
  static validateGuatemalaPhone(phone) {
    if (!phone) return true; // Es opcional
    const phoneRegex = /^(\+502\s?)?[2-9]\d{3}[-\s]?\d{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
}

// Error personalizado para validación
class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
    this.statusCode = 400;
  }
}

export { ValidationService, ValidationError };