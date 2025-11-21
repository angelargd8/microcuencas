# Configuración de Templates de EmailJS para Backend

Esta guía detalla cómo configurar las plantillas de email en EmailJS para el sistema de contacto del proyecto Microcuencas.

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Paso 0: Configurar Servicio de Gmail en EmailJS](#paso-0-configurar-servicio-de-gmail-en-emailjs)
3. [Template 1: Email Principal (Notificación al Administrador)](#template-1-email-principal-notificación-al-administrador)
4. [Template 2: Email de Confirmación (Auto-Reply al Usuario)](#template-2-email-de-confirmación-auto-reply-al-usuario)
5. [Variables Disponibles](#variables-disponibles)
6. [Configuración en el Backend](#configuración-en-el-backend)

---

## Requisitos Previos

1. Cuenta activa en [EmailJS](https://www.emailjs.com/)
2. Cuenta de Gmail (o servicio de email compatible)
3. Acceso al archivo `.env` del backend

---

## Paso 0: Configurar Servicio de Gmail en EmailJS

**IMPORTANTE:** Antes de crear las templates, debes configurar el servicio de email en EmailJS.

### 1. Acceder a Email Services

1. Inicia sesión en [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Ve a **Email Services** en el menú lateral
3. Haz clic en **Add New Service**

### 2. Seleccionar Gmail

1. Selecciona **Gmail** de la lista de servicios disponibles
2. Haz clic en **Connect Account**
3. Autoriza a EmailJS para acceder a tu cuenta de Gmail
4. Sigue las instrucciones de Google para autorizar la aplicación

### 3. Copiar las credenciales

Una vez conectado el servicio, verás:

- **Service ID**: Aparecerá algo como `service_r9nnuha`
- **Public Key**: En Account → API Keys
- **Private Key**: En Account → API Keys

### 4. Agregar las credenciales al archivo `.env`

Abre el archivo [backend/.env](backend/.env) y agrega las siguientes líneas:

```env
# EmailJS Service Configuration
EMAILJS_PUBLIC_KEY=XXXXXXXXXXXXXXXX
EMAILJS_PRIVATE_KEY=XXXXXXXXXXXXXXXX
EMAILJS_SERVICE_ID=service_XXXXXXXXXXXXXXXX
```


### 5. Verificar la conexión

Para verificar que el servicio está correctamente configurado:

1. En EmailJS Dashboard, ve a **Email Services**
2. Tu servicio de Gmail debe aparecer con un estado **Active** (verde)
3. Puedes hacer una prueba de envío desde el dashboard

### Notas importantes sobre Gmail

- **App Passwords**: Si tienes autenticación de dos factores habilitada en Gmail, es posible que necesites crear una contraseña de aplicación
- **Límites de envío**: Gmail tiene límites de envío diarios (~500 emails/día)
- **Seguridad**: Asegúrate de que tu cuenta de Gmail tenga configurada la verificación en dos pasos para mayor seguridad

---

## Template 1: Email Principal (Notificación al Administrador)

Esta template se usa para notificar al administrador del proyecto cuando alguien llena el formulario de contacto.

### Paso 1: Crear la Template en EmailJS

1. Inicia sesión en [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Ve a **Email Templates** → **Create New Template**
3. Copia el **Template ID** generado (ejemplo: `template_abcdefg`)

### Paso 2: Configurar los campos de la template

#### Subject (Asunto)
```
🌿 Nuevo interés en {{proyecto_nombre}} - {{nombre_completo}}
```

#### To Email (Destinatario)
```
{{to_email}}
```
> Este campo se llenará automáticamente con el valor de `PROJECT_EMAIL` del archivo `.env`

#### From Name (Nombre del remitente)
```
{{sender_service}}
```
> Este campo se llenará con el valor de `SENDER_NAME` del archivo `.env`

#### From Email (Email del remitente)
**Seleccionar:** `[X] Use Default Email Address`

> Esto usa el email configurado en tu servicio de EmailJS

#### Reply To (Responder a)
```
{{reply_to}}
```
> Esto permite que al responder el email, se responda directamente al usuario que llenó el formulario

### Paso 3: Contenido HTML

Copia y pega el siguiente contenido en el editor HTML de la template:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Reset para Outlook */
        table, td, div, h1, h2, h3, p {
            margin: 0;
            padding: 0;
        }

        /* Fuentes seguras para Outlook */
        body, table, td, p, a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            font-family: Arial, Helvetica, sans-serif !important;
        }

        /* Prevenir auto-scaling en Outlook */
        table, td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }

        /* Colores seguros para Outlook */
        .header-bg {
            background-color: #2c5530 !important;
        }

        .success-bg {
            background-color: #28a745 !important;
        }

        .light-bg {
            background-color: #f8f9fa !important;
        }

        .white-bg {
            background-color: #ffffff !important;
        }

        .green-text {
            color: #2c5530 !important;
        }

        .white-text {
            color: #ffffff !important;
        }

        .gray-text {
            color: #495057 !important;
        }

        .dark-text {
            color: #333333 !important;
        }

        /* Responsive para móviles */
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                max-width: 100% !important;
            }

            .content-padding {
                padding: 15px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa;">
    <!-- Contenedor principal - Tabla para compatibilidad con Outlook -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
        <tr>
            <td align="center" style="padding: 20px 0;">

                <!-- Email Container -->
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">

                    <!-- Header -->
                    <tr>
                        <td class="header-bg" style="background-color: #2c5530; padding: 30px 20px; text-align: center;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center;">
                                        <h1 class="white-text" style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 8px 0; line-height: 1.2;">
                                            🌿 Nuevo Interés Recibido
                                        </h1>
                                        <p class="white-text" style="color: #ffffff; font-size: 16px; margin: 0 0 15px 0; opacity: 0.9;">
                                            Alguien quiere participar en la conservación de la microcuenca
                                        </p>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                            <tr>
                                                <td class="success-bg" style="background-color: #28a745; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                                                    Nuevo Contacto
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td class="content-padding" style="padding: 30px 20px;">

                            <!-- Info Section -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="light-bg" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 20px;">

                                        <!-- Info Rows -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">

                                            <!-- Nombre -->
                                            <tr>
                                                <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="25" style="font-size: 18px; text-align: center;">👤</td>
                                                            <td width="120" class="green-text" style="color: #2c5530; font-weight: 600; min-width: 120px;">Nombre:</td>
                                                            <td class="gray-text" style="color: #495057;">{{nombre_completo}}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Email -->
                                            <tr>
                                                <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="25" style="font-size: 18px; text-align: center;">📧</td>
                                                            <td width="120" class="green-text" style="color: #2c5530; font-weight: 600;">Email:</td>
                                                            <td class="gray-text" style="color: #495057;">{{email_contacto}}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Teléfono -->
                                            <tr>
                                                <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="25" style="font-size: 18px; text-align: center;">📱</td>
                                                            <td width="120" class="green-text" style="color: #2c5530; font-weight: 600;">Teléfono:</td>
                                                            <td class="gray-text" style="color: #495057;">{{telefono_contacto}}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Carrera -->
                                            <tr>
                                                <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="25" style="font-size: 18px; text-align: center;">🎓</td>
                                                            <td width="120" class="green-text" style="color: #2c5530; font-weight: 600;">Carrera:</td>
                                                            <td class="gray-text" style="color: #495057;">{{carrera_estudio}}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Año de estudio -->
                                            <tr>
                                                <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="25" style="font-size: 18px; text-align: center;">📚</td>
                                                            <td width="120" class="green-text" style="color: #2c5530; font-weight: 600;">Año de estudio:</td>
                                                            <td class="gray-text" style="color: #495057;">{{anio_estudio}}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Tipo de interés -->
                                            <tr>
                                                <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="25" style="font-size: 18px; text-align: center;">🤝</td>
                                                            <td width="120" class="green-text" style="color: #2c5530; font-weight: 600;">Tipo de interés:</td>
                                                            <td class="gray-text" style="color: #495057;">{{tipo_interes}}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Fecha -->
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="25" style="font-size: 18px; text-align: center;">📅</td>
                                                            <td width="120" class="green-text" style="color: #2c5530; font-weight: 600;">Fecha:</td>
                                                            <td class="gray-text" style="color: #495057;">{{fecha_solicitud}}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Message Section -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #e8f5e8; border-left: 4px solid #2c5530; border-radius: 0 8px 8px 0; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 class="green-text" style="color: #2c5530; margin: 0 0 10px 0; font-size: 16px;">💬 Mensaje del interesado:</h3>
                                        <div class="gray-text" style="color: #495057; white-space: pre-wrap; font-style: italic;">{{mensaje_contacto}}</div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Action Items -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <p class="dark-text" style="color: #333333; font-weight: 600; margin: 0 0 10px 0;">¿Qué hacer ahora?</p>
                                        <ul class="gray-text" style="color: #495057; margin: 0 0 0 20px; padding: 0;">
                                            <li style="margin-bottom: 5px;">Revisar el perfil del interesado</li>
                                            <li style="margin-bottom: 5px;">Contactar dentro de 3-5 días hábiles</li>
                                            <li style="margin-bottom: 5px;">Coordinar reunión o actividad introductoria</li>
                                            <li>Enviar información adicional del proyecto</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="light-bg" style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center;">
                                        <p class="dark-text" style="color: #333333; font-weight: 600; font-size: 14px; margin: 0 0 5px 0;">{{proyecto_nombre}}</p>
                                        <p class="gray-text" style="color: #6c757d; font-size: 14px; margin: 0 0 5px 0;">{{universidad}}</p>
                                        <p class="gray-text" style="color: #6c757d; font-size: 14px; margin: 0 0 5px 0;">Este email fue generado automáticamente por el sistema web del proyecto.</p>
                                        <p class="gray-text" style="color: #6c757d; font-size: 14px; margin: 0;">Para responder, simplemente contesta a este email.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>
</body>
</html>
```

### Paso 4: Agregar el Template ID al archivo `.env`

Copia el Template ID generado por EmailJS y agrégalo al archivo `.env`:

```env
EMAILJS_TEMPLATE_ID=template_XXXXXXX
```

---

## Template 2: Email de Confirmación (Auto-Reply al Usuario)

Esta template se envía automáticamente al usuario como confirmación de que su solicitud fue recibida.

### Paso 1: Crear la Template en EmailJS

1. Ve a **Email Templates** → **Create New Template**
2. Copia el **Template ID** generado (ejemplo: `template_hijklmn`)

### Paso 2: Configurar los campos de la template

#### Subject (Asunto)
```
Confirmación - {{proyecto_nombre}}
```

#### To Email (Destinatario)
```
{{to_email}}
```
> En este caso, se enviará al email del usuario que llenó el formulario

#### From Name (Nombre del remitente)
```
{{sender_service}}
```
> Este campo se llenará con el valor de `SENDER_NAME` del archivo `.env`

#### From Email (Email del remitente)
**Seleccionar:** `[X] Use Default Email Address`

> No se configura Reply To en esta template, ya que el usuario puede responder directamente al email

### Paso 3: Contenido HTML

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación - {{proyecto_nombre}}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f8f9fa;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }

        .header h1 {
            font-size: 26px;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .content {
            padding: 35px 25px;
        }

        .welcome-message {
            text-align: center;
            margin-bottom: 30px;
        }

        .welcome-message h2 {
            color: #2c5530;
            font-size: 22px;
            margin-bottom: 15px;
        }

        .highlight {
            color: #28a745;
            font-weight: 600;
        }

        .steps-section {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }

        .steps-title {
            color: #2c5530;
            font-size: 18px;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .step-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            padding: 8px 0;
        }

        .step-icon {
            font-size: 16px;
            margin-right: 12px;
            margin-top: 2px;
        }

        .step-text {
            color: #495057;
            flex: 1;
        }

        .info-box {
            background-color: #e8f5e8;
            border: 1px solid #28a745;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }

        .info-box p {
            margin-bottom: 10px;
            color: #155724;
        }

        .contact-info {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }

        .contact-info p {
            color: #856404;
            font-size: 14px;
        }

        .footer {
            background-color: #f8f9fa;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }

        .footer h3 {
            color: #2c5530;
            margin-bottom: 8px;
        }

        .footer p {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 5px;
        }

        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 10px;
            }
            .content {
                padding: 25px 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Gracias por tu interés</h1>
            <p>Tu solicitud ha sido recibida exitosamente</p>
        </div>

        <div class="content">
            <div class="welcome-message">
                <h2>Hola <span class="highlight">{{to_name}}</span></h2>
                <p>Hemos recibido tu interés en participar en nuestra <span class="highlight">{{proyecto_nombre}}</span>.</p>
            </div>

            <div class="info-box">
                <p><strong>Tu participación es valiosa</strong></p>
                <p>Cada persona que se suma al proyecto hace una diferencia real en la conservación de nuestros recursos hídricos y la protección del ecosistema de la microcuenca.</p>
            </div>

            <div class="steps-section">
                <h3 class="steps-title">¿Qué sigue ahora?</h3>

                <div class="step-item">
                    <span class="step-icon">1.</span>
                    <span class="step-text">Te contactaremos en los próximos <strong>3-5 días hábiles</strong></span>
                </div>

                <div class="step-item">
                    <span class="step-icon">2.</span>
                    <span class="step-text">Te enviaremos más información sobre las actividades disponibles</span>
                </div>

                <div class="step-item">
                    <span class="step-icon">3.</span>
                    <span class="step-text">Coordinaremos una reunión o actividad de introducción</span>
                </div>

                <div class="step-item">
                    <span class="step-icon">4.</span>
                    <span class="step-text">Comenzarás tu participación en la conservación</span>
                </div>
            </div>

            <p style="color: #495057; text-align: center; font-size: 16px;">
                <strong>Mensaje personalizado:</strong><br>
                <em>{{mensaje_confirmacion}}</em>
            </p>

            <div class="contact-info">
                <p><strong>¿Tienes preguntas urgentes?</strong></p>
                <p>Puedes escribir directamente a: <strong>{{email_proyecto}}</strong></p>
            </div>

            <p style="text-align: center; color: #28a745; font-size: 18px; margin: 25px 0;">
                <strong>Gracias por sumarte a la conservación de nuestros recursos hídricos</strong>
            </p>
        </div>

        <div class="footer">
            <h3>{{proyecto_nombre}}</h3>
            <p><strong>{{universidad}}</strong></p>
            <p>Fecha de confirmación: {{fecha_confirmacion}}</p>
            <p style="margin-top: 10px; color: #6c757d;">
                Este es un email automático, por favor no respondas directamente.<br>
                Para contactarnos, usa: {{email_proyecto}}
            </p>
        </div>
    </div>
</body>
</html>
```

### Paso 4: Agregar el Template ID al archivo `.env`

```env
EMAILJS_CONFIRMATION_TEMPLATE_ID=template_XXXXXXX
```

---

## Variables Disponibles

### Variables del Template Principal (Notificación al Administrador)

Estas variables son enviadas automáticamente por el backend ([emailService.js:32-62](backend/services/emailService.js#L32-L62)):

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{to_email}}` | Email del administrador del proyecto | `lop22716@uvg.edu.gt` |
| `{{from_name}}` | Nombre del usuario que envía | `Juan Pérez` |
| `{{from_email}}` | Email del usuario | `juan.perez@uvg.edu.gt` |
| `{{reply_to}}` | Email para responder (mismo que from_email) | `juan.perez@uvg.edu.gt` |
| `{{nombre_completo}}` | Nombre completo del usuario | `Juan Pérez García` |
| `{{email_contacto}}` | Email del usuario | `juan.perez@uvg.edu.gt` |
| `{{telefono_contacto}}` | Teléfono del usuario | `+502 1234-5678` |
| `{{carrera_estudio}}` | Carrera universitaria | `Ingeniería Ambiental` |
| `{{anio_estudio}}` | Año de estudio | `Tercer año` |
| `{{tipo_interes}}` | Tipo de interés seleccionado | `voluntario-campo` |
| `{{mensaje_contacto}}` | Mensaje del usuario | `Estoy interesado en...` |
| `{{fecha_solicitud}}` | Fecha y hora formateada | `21 de noviembre de 2025, 3:45 PM` |
| `{{proyecto_nombre}}` | Nombre del proyecto | `Microcuencas` |
| `{{universidad}}` | Nombre de la universidad | `Universidad del Valle de Guatemala` |
| `{{sender_service}}` | Nombre del servicio remitente | `Xavier López - Proyecto Microcuenca` |
| `{{trackingId}}` | ID de seguimiento único | `MCR_1732223456789_abc123` |
| `{{timestamp}}` | Timestamp ISO 8601 | `2025-11-21T15:45:30.123Z` |

### Variables del Template de Confirmación

Estas variables son enviadas por el backend ([emailService.js:68-78](backend/services/emailService.js#L68-L78)):

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{to_email}}` | Email del usuario que llenó el formulario | `juan.perez@uvg.edu.gt` |
| `{{to_name}}` | Nombre del usuario | `Juan Pérez García` |
| `{{proyecto_nombre}}` | Nombre del proyecto | `Microcuencas` |
| `{{universidad}}` | Nombre de la universidad | `Universidad del Valle de Guatemala` |
| `{{email_proyecto}}` | Email del proyecto para responder | `lop22716@uvg.edu.gt` |
| `{{mensaje_confirmacion}}` | Mensaje personalizado según tipo de interés | `Te contactaremos para coordinar actividades de campo...` |
| `{{fecha_confirmacion}}` | Fecha y hora de la confirmación | `21 de noviembre de 2025, 3:45 PM` |

### Mensajes de Confirmación según Tipo de Interés

El sistema genera automáticamente mensajes personalizados ([emailService.js:83-95](backend/services/emailService.js#L83-L95)):

| Tipo de Interés | Mensaje |
|-----------------|---------|
| `voluntario-campo` | Te contactaremos para coordinar actividades de campo y conservación. |
| `investigacion` | Nuestro equipo de investigación se pondrá en contacto contigo. |
| `divulgacion` | Te incluiremos en nuestras actividades de educación ambiental. |
| `financiamiento` | Un coordinador del proyecto te contactará para discutir opciones de apoyo. |
| `tesis` | Te conectaremos con supervisores para proyectos de investigación. |
| `servicio-social` | Te ayudaremos a estructurar tu servicio social con el proyecto. |
| `practica-profesional` | Coordinaremos tu práctica profesional con nuestras actividades. |
| *otro* | Nuestro equipo revisará tu solicitud y te contactará pronto. |

---

## Configuración en el Backend

### Archivo: [backend/.env](backend/.env)

Este archivo contiene todas las credenciales y configuraciones necesarias:

```env
# ====================================
# EMAILJS CONFIGURATION
# ====================================
# Obtener estas credenciales desde: https://dashboard.emailjs.com/

# Public Key de tu cuenta EmailJS
EMAILJS_PUBLIC_KEY=xxxxxxx

# Private Key de tu cuenta EmailJS (mantener en secreto)
EMAILJS_PRIVATE_KEY=xxxxxxx

# Service ID del servicio de email configurado (Gmail, Outlook, etc.)
EMAILJS_SERVICE_ID=service_xxxxxxx

# Template ID del email principal (notificación al administrador)
EMAILJS_TEMPLATE_ID=template_xxxxxxx

# Template ID del email de confirmación (auto-reply al usuario)
EMAILJS_CONFIRMATION_TEMPLATE_ID=template_xxxxxxx

# ====================================
# PROJECT EMAIL SETTINGS
# ====================================
# Email que recibirá las notificaciones de contacto
PROJECT_EMAIL=correo_contacto@uvg.edu.gt

# Email que aparecerá como remitente
SENDER_EMAIL=correo_contacto@uvg.edu.gt

# Nombre que aparecerá como remitente
SENDER_NAME=NombreRemitente - Proyecto Microcuenca

# ====================================
# OTHER SETTINGS
# ====================================
# Puerto del servidor backend
PORT=3001

# Ambiente de ejecución
NODE_ENV=production

# Mostrar detalles de errores en las respuestas
SHOW_ERROR_DETAILS=false

# Nivel de logging (warn, info, debug)
LOG_LEVEL=info

# Orígenes permitidos para CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Máximo de peticiones por ventana de rate limiting
RATE_LIMIT_MAX=3

# Habilitar/deshabilitar email de confirmación
ENABLE_CONFIRMATION=true
```

### Variables Requeridas

**Obligatorias** (el servidor no iniciará sin estas):
- `EMAILJS_PUBLIC_KEY`
- `EMAILJS_PRIVATE_KEY`
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `PROJECT_EMAIL`

**Opcionales** (tienen valores por defecto):
- `EMAILJS_CONFIRMATION_TEMPLATE_ID` (si no se proporciona, no se envían confirmaciones)
- `SENDER_EMAIL` (por defecto usa PROJECT_EMAIL)
- `SENDER_NAME` (por defecto usa "Proyecto de Microcuencas")
- `ENABLE_CONFIRMATION` (por defecto `true`)

### Dónde obtener las credenciales de EmailJS

1. **Public Key y Private Key:**
   - Dashboard → Account → API Keys
   - [https://dashboard.emailjs.com/admin/account](https://dashboard.emailjs.com/admin/account)

2. **Service ID:**
   - Dashboard → Email Services → Selecciona tu servicio
   - Copia el Service ID (ejemplo: `service_xxxxxxx`)
   - [https://dashboard.emailjs.com/admin](https://dashboard.emailjs.com/admin)

3. **Template ID:**
   - Dashboard → Email Templates → Selecciona tu template
   - Copia el Template ID (ejemplo: `template_xxxxxxx`)
   - [https://dashboard.emailjs.com/admin/templates](https://dashboard.emailjs.com/admin/templates)

---

## Verificación de la Configuración

### Prueba 1: Verificar configuración del backend

```bash
cd /microcuencas/backend
npm run dev
```

Si todo está configurado correctamente, deberías ver en los logs:
```
[INFO] EmailJS inicializado correctamente.
[INFO] Server running on port 3001
```

### Prueba 2: Probar el envío de emails

Puedes usar el archivo de prueba [backend/testemailjs.js](backend/testemailjs.js):

```bash
node backend/testemailjs.js
```

### Prueba 3: Hacer una petición de prueba

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Prueba Test",
    "email": "prueba@test.com",
    "telefono": "12345678",
    "carrera": "Ingeniería",
    "anioEstudio": "Tercer año",
    "tipoInteres": "voluntario-campo",
    "mensaje": "Este es un mensaje de prueba"
  }'
```

---

## Troubleshooting

### Error: "Configuración de email faltante"

**Causa:** Faltan variables requeridas en el `.env`

**Solución:** Verifica que todas las variables obligatorias estén configuradas:
```bash
grep -E "EMAILJS_|PROJECT_EMAIL" backend/.env
```

### Error: "Error al inicializar EmailJS"

**Causa:** Las credenciales de EmailJS son inválidas

**Solución:**
1. Verifica las credenciales en [EmailJS Dashboard](https://dashboard.emailjs.com/admin/account)
2. Asegúrate de no tener espacios extra en el `.env`
3. Reinicia el servidor después de cambiar el `.env`

### Los emails no llegan

**Posibles causas:**

1. **Template ID incorrecto:**
   - Verifica el Template ID en EmailJS Dashboard
   - Asegúrate de que esté activo

2. **Variables mal configuradas:**
   - Verifica que los nombres de las variables en la template coincidan exactamente con los del código
   - Ejemplo: `{{to_email}}` (correcto) vs `{{toEmail}}` (incorrecto)

3. **Service ID incorrecto:**
   - Verifica el Service ID en EmailJS Dashboard
   - Asegúrate de que el servicio esté conectado y activo

4. **Rate limiting de EmailJS:**
   - EmailJS tiene límites de envío
   - Verifica tu cuota en el dashboard

### Email de confirmación no se envía

**Verifica:**

1. Que `ENABLE_CONFIRMATION=true` en el `.env`
2. Que `EMAILJS_CONFIRMATION_TEMPLATE_ID` esté configurado
3. Revisa los logs del servidor para ver mensajes de advertencia

---

## Archivos Relacionados

- **Configuración de Email:** [backend/config/email.js](backend/config/email.js)
- **Servicio de Email:** [backend/services/emailService.js](backend/services/emailService.js)
- **Variables de Entorno:** [backend/.env](backend/.env)
- **Pruebas:** [backend/testemailjs.js](backend/testemailjs.js)
- **Tests Unitarios:** [backend/__tests__/services/emailService.test.js](backend/__tests__/services/emailService.test.js)

---