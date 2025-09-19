import emailjs from "@emailjs/nodejs"
import { emailConfig } from "../config/email.js"
import logger from "../utils/logger.js"
import { formatearFechaGuatemala, generateTrackingId } from "../utils/helpers.js"

class EmailService {
    constructor() {
        this.isInitialized = false;
        this.initializeEmailJS();
    }

    /**
     * Inicialización de EmailJS
     */
    initializeEmailJS() {
        try {
            emailjs.init({
                publicKey: emailConfig.emailjs.publicKey,
                privateKey: emailConfig.emailjs.privateKey,
            });
            this.isInitialized = true;
            logger.info("EmailJS inicializado correctamente.");
        } catch (error) {
            logger.error("Error al inicializar EmailJS:", error);
            throw new Error("Error en configuración de EmailJS");
        }
    }

    /**
     * Construir parámetros del template
     */
    buildTemplateParams(contactData) {
        const trackingId = generateTrackingId();

        return {
            // Destinatario
            to_email: emailConfig.project.email,

            // Remitente y respuesta
            from_name: contactData.nombre,
            from_email: contactData.email,
            reply_to: contactData.email,

            // Datos del contacto
            nombre_completo: contactData.nombre,
            email_contacto: contactData.email,
            telefono_contacto: contactData.telefono || "No proporcionado",
            carrera_estudio: contactData.carrera || "No proporcionado",
            anio_estudio: contactData.anioEstudio || "No especificado",
            tipo_interes: contactData.tipoInteres || "Información general",
            mensaje_contacto: contactData.mensaje || "Sin mensaje adicional",
            fecha_solicitud: formatearFechaGuatemala(),

            // Información del proyecto
            proyecto_nombre: emailConfig.project.name,
            universidad: emailConfig.project.university,
            trackingId: trackingId,

            // Metadatos
            sender_service: emailConfig.project.senderName,
            timestamp: new Date().toISOString(),
        };
    }

    /**
    * Construir parámetros para email de confirmación
    */
    buildConfirmationParams(contactData) {
        return {
        to_email: contactData.email,
        to_name: contactData.nombre,
        proyecto_nombre: emailConfig.project.name,
        universidad: emailConfig.project.university,
        email_proyecto: emailConfig.project.email,
        mensaje_confirmacion: this.getConfirmationMessage(contactData.tipoInteres),
        fecha_confirmacion: formatearFechaGuatemala()
        };
    }

    /**
     * Obtener mensaje personalizado según tipo de interés
     */
    getConfirmationMessage(tipoInteres) {
        const messages = {
        'voluntario-campo': 'Te contactaremos para coordinar actividades de campo y conservación.',
        'investigacion': 'Nuestro equipo de investigación se pondrá en contacto contigo.',
        'divulgacion': 'Te incluiremos en nuestras actividades de educación ambiental.',
        'financiamiento': 'Un coordinador del proyecto te contactará para discutir opciones de apoyo.',
        'tesis': 'Te conectaremos con supervisores para proyectos de investigación.',
        'servicio-social': 'Te ayudaremos a estructurar tu servicio social con el proyecto.',
        'practica-profesional': 'Coordinaremos tu práctica profesional con nuestras actividades.'
        };

        return messages[tipoInteres] || 'Nuestro equipo revisará tu solicitud y te contactará pronto.';
    }

    /**
     * Enviar email principal al encargado del proyecto
     */
    async sendMainEmail(contactData) {
        if (!this.isInitialized) {
        throw new Error('EmailJS no está inicializado');
        }

        const templateParams = this.buildTemplateParams(contactData);
        
        logger.info('Enviando email principal', {
        to: emailConfig.project.email,
        from: contactData.email,
        trackingId: templateParams.tracking_id
        });

        try {
        const result = await emailjs.send(
            emailConfig.emailjs.serviceId,
            emailConfig.emailjs.templateId,
            templateParams
        );

        logger.info('Email principal enviado exitosamente', {
            status: result.status,
            trackingId: templateParams.tracking_id
        });

        return {
            success: true,
            messageId: result.text,
            trackingId: templateParams.tracking_id
        };
        } catch (error) {
        logger.error('Error enviando email principal:', {
            error: error.message,
            status: error.status,
            trackingId: templateParams.tracking_id
        });
        throw error;
        }
    }

    /**
     * Enviar email de confirmación al usuario
     */
    async sendConfirmationEmail(contactData) {
        if (!emailConfig.settings.enableConfirmation || !emailConfig.emailjs.confirmationTemplateId) {
        logger.info('Confirmación de email deshabilitada');
        return { success: false, reason: 'confirmation_disabled' };
        }

        const confirmationParams = this.buildConfirmationParams(contactData);
        
        logger.info('Enviando email de confirmación', {
        to: contactData.email
        });

        try {
        const result = await emailjs.send(
            emailConfig.emailjs.serviceId,
            emailConfig.emailjs.confirmationTemplateId,
            confirmationParams
        );

        logger.info('Email de confirmación enviado exitosamente', {
            status: result.status,
            to: contactData.email
        });

        return {
            success: true,
            messageId: result.text
        };
        } catch (error) {
        logger.warn('Error enviando confirmación (no crítico):', {
            error: error.message,
            to: contactData.email
        });
        
        // No fallar por esto, el email principal ya se envió
        return { 
            success: false, 
            error: error.message,
            reason: 'confirmation_failed'
        };
        }
    }

    /**
     * Procesar envío completo de emails
     */
    async processContactEmail(contactData) {
        try {
        // Enviar email principal (crítico)
        const mainResult = await this.sendMainEmail(contactData);
        
        // Enviar confirmación (opcional)
        const confirmationResult = await this.sendConfirmationEmail(contactData);
        
        return {
            success: true,
            mainEmail: mainResult,
            confirmation: confirmationResult,
            timestamp: new Date().toISOString()
        };
        } catch (error) {
        logger.error('Error en proceso de envío de emails:', error);
        throw error;
        }
    }
}

export default EmailService;
