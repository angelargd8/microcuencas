import { emailConfig } from '../config/email.js';

/**
 * Formatea fecha en zona horaria de Guatemala
 */
const formatearFechaGuatemala = () => {
  return new Date().toLocaleString('es-GT', {
    timeZone: emailConfig.settings.timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Sanitiza string removiendo caracteres peligrosos
 */
const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') {return '';}
  return str.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

/**
 * Capitaliza primera letra de cada palabra
 */
const capitalizeWords = (str) => {
  if (!str) {return '';}
  return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Genera ID único para tracking
 */
const generateTrackingId = () => {
  return `MC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Valida si el email pertenece a UVG
 */
const isUVGEmail = (email) => {
  return email && email.toLowerCase().includes('@uvg.edu.gt');
};

export { formatearFechaGuatemala, sanitizeString, capitalizeWords, generateTrackingId, isUVGEmail };