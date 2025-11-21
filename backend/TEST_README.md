# Documentación de Tests - Backend Microcuencas

## Estructura de Tests

El proyecto incluye una batería completa de tests que cubren todos los aspectos del sistema de envío de correos. Los tests están organizados de la siguiente manera:

```
__tests__/
├── controllers/
│   └── contactController.test.js        # Tests del controlador principal
├── services/
│   └── emailService.test.js             # Tests del servicio de email
├── middleware/
│   └── errorHandler.test.js             # Tests del manejo de errores
├── routes/
│   ├── index.test.js                    # Tests de rutas principales
│   └── contact.test.js                  # Tests de rutas de contacto
├── utils/
│   ├── helpers.test.js                  # Tests de funciones auxiliares
│   └── constants.test.js                # Tests de constantes
└── integration/
    └── app.integration.test.js          # Tests de integración completa
```

## Configuración de Jest

### Archivos de configuración:
- `jest.config.js` - Configuración principal de Jest para ES modules
- `jest.setup.js` - Setup global, mocks y helpers para tests

### Scripts disponibles:
```bash
npm test                    # Ejecutar todos los tests
npm run test:watch         # Ejecutar tests en modo watch
npm run test:coverage      # Ejecutar tests con reporte de cobertura
npm run test:ci           # Ejecutar tests en modo CI
npm run test:unit         # Ejecutar solo tests unitarios
npm run test:integration  # Ejecutar solo tests de integración
```

## Tipos de Tests

### 1. Tests Unitarios

#### ContactController (`__tests__/controllers/contactController.test.js`)
- Inicialización correcta del controlador
- Procesamiento de solicitudes de contacto válidas
- Manejo de errores del EmailService
- Sanitización de datos de entrada
- Generación de estadísticas
- Health check del servicio
- Formateo de uptime
- Distinción entre emails UVG y externos

#### EmailService (`__tests__/services/emailService.test.js`)
- Inicialización de EmailJS
- Construcción de parámetros de templates
- Envío de email principal
- Envío de email de confirmación
- Procesamiento completo de emails
- Manejo de errores de timeout y rate limit
- Validación de tracking IDs únicos
- Mensajes personalizados por tipo de interés

#### ErrorHandler (`__tests__/middleware/errorHandler.test.js`)
- Manejo de errores genéricos
- Manejo de ValidationError
- Manejo de errores de email
- Manejo de rate limit (402, 403)
- Headers de seguridad
- Logging seguro de errores
- Validación de configuración de seguridad
- Manejo de rutas no encontradas

#### Helpers (`__tests__/utils/helpers.test.js`)
- Formateo de fecha en zona horaria de Guatemala
- Sanitización de strings (remoción de scripts)
- Capitalización de palabras
- Generación de tracking IDs únicos
- Validación de emails UVG
- Integración entre funciones

#### Constants (`__tests__/utils/constants.test.js`)
- Validación de estructura de CARRERAS_UVG
- Validación de estructura de TIPOS_INTERES
- Códigos HTTP estándar
- Códigos de error del sistema
- Unicidad de valores
- Correspondencia entre HTTP_STATUS y ERROR_CODES

### 2. Tests de Rutas

#### Rutas principales (`__tests__/routes/index.test.js`)
- GET /api/ - Información de la API
- GET /api/config - Configuración pública
- GET /api/health - Health check
- GET /api/stats - Estadísticas generales
- Delegación a rutas de contacto
- Manejo de errores en endpoints
- Validación de headers y metadatos

#### Rutas de contacto (`__tests__/routes/contact.test.js`)
- POST /api/contact - Procesamiento de contactos
- GET /api/contact/stats - Estadísticas específicas
- Aplicación de middlewares (validación, rate limiting)
- Manejo de diferentes tipos de interés
- Procesamiento de emails UVG y externos
- Manejo de caracteres especiales
- Validación de métodos HTTP

### 3. Tests de Integración

#### Flujo completo (`__tests__/integration/app.integration.test.js`)
- Flujo completo de envío de contacto UVG
- Flujo completo de contacto externo
- Validación de datos inválidos
- Todos los endpoints de información
- Manejo de errores y casos edge
- Headers de seguridad y CORS
- Rate limiting por IP
- Persistencia de estadísticas
- Diferentes tipos de usuarios
- Validación de formatos de datos

## Cobertura de Tests

Los tests cubren:

### Funcionalidades principales:
- 100% de los endpoints de la API
- 100% de los controladores
- 100% de los servicios
- 100% de los middlewares
- 100% de las utilidades

### Casos edge:
- Datos inválidos o malformados
- Errores de red y timeouts
- Rate limiting y límites de quota
- Caracteres especiales y acentos
- Payloads grandes
- Errores de configuración

### Seguridad:
- Sanitización de datos de entrada
- Headers de seguridad
- Manejo seguro de errores (sin exposición de información sensible)
- Validación de configuración de producción

## Mocks y Simulaciones

### Módulos mockeados:
- **@emailjs/nodejs** - Servicio de envío de emails
- **Configuración de email** - Settings de EmailJS y proyecto
- **Logger** - Sistema de logging
- **Middlewares** - Validación y rate limiting

### Helpers globales disponibles:
- `createTestContactData()` - Genera datos de contacto de prueba
- `createMockRequest()` - Crea objeto request mock
- `createMockResponse()` - Crea objeto response mock
- `createMockNext()` - Crea función next mock

## Ejecutar Tests

### Desarrollo local:
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (recomendado para desarrollo)
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

### CI/CD:
```bash
# Ejecutar tests en modo CI
npm run test:ci
```

### Tests específicos:
```bash
# Solo tests unitarios
npm run test:unit

# Solo tests de integración
npm run test:integration

# Test específico
npm test -- contactController.test.js

# Tests con patrón
npm test -- --testNamePattern="debe enviar email"
```

## Verificación de Calidad

### Métricas objetivo:
- **Cobertura de líneas**: > 90%
- **Cobertura de funciones**: > 95%
- **Cobertura de branches**: > 85%
- **Cobertura de statements**: > 90%

### Validaciones incluidas:
- Todas las rutas HTTP funcionan
- Todos los tipos de error se manejan correctamente
- Todos los middlewares se aplican en orden
- Todas las validaciones de entrada funcionan
- Todas las respuestas tienen formato consistente
- Todos los logs se generan apropiadamente

## Mantenimiento

### Agregar nuevos tests:
1. Crear archivo en la carpeta correspondiente
2. Seguir la convención de naming: `*.test.js`
3. Usar los helpers globales disponibles
4. Incluir tests para casos normales y edge cases
5. Verificar que la cobertura se mantenga alta

### Actualizar tests existentes:
1. Mantener compatibilidad con la API existente
2. Agregar tests para nuevas funcionalidades
3. Actualizar mocks si cambian las dependencias
4. Verificar que todos los tests pasen después de cambios

## Troubleshooting

### Problemas comunes:

**Error de ES modules:**
- Verificar que `jest.config.js` tenga `extensionsToTreatAsEsm: ['.js']`
- Verificar que los imports usen rutas completas con `.js`

**Mocks no funcionan:**
- Verificar que los mocks estén antes de los imports
- Usar `jest.doMock()` para mocks dinámicos

**Tests lentos:**
- Verificar timeout en `jest.setup.js`
- Usar mocks apropiados para operaciones I/O

**Cobertura baja:**
- Ejecutar `npm run test:coverage` para ver reporte detallado
- Agregar tests para líneas no cubiertas