const CARRERAS_UVG = [
  // === INGENIERÍA ===
  { value: 'ing-biomedica', label: 'Ingeniería Biomédica', categoria: 'Ingeniería' },
  { value: 'ing-biotecnologia-industrial', label: 'Ingeniería en Biotecnología Industrial', categoria: 'Ingeniería' },
  { value: 'ing-ciencia-administracion', label: 'Ingeniería en Ciencia de la Administración', categoria: 'Ingeniería' },
  { value: 'ing-ciencias-alimentos', label: 'Ingeniería en Ciencias de Alimentos', categoria: 'Ingeniería' },
  { value: 'ing-ciencias-alimentos-industrial', label: 'Ingeniería en Ciencias de Alimentos Industrial', categoria: 'Ingeniería' },
  { value: 'ing-civil', label: 'Ingeniería Civil', categoria: 'Ingeniería' },
  { value: 'ing-civil-arquitectonica', label: 'Ingeniería Civil Arquitectónica', categoria: 'Ingeniería' },
  { value: 'ing-ciencia-computacion', label: 'Ingeniería en Ciencia de la Computación y TI', categoria: 'Ingeniería' },
  { value: 'ing-sistemas-informacion', label: 'Ingeniería en Sistemas de Información Computacional', categoria: 'Ingeniería' },
  { value: 'ing-electronica', label: 'Ingeniería Electrónica', categoria: 'Ingeniería' },
  { value: 'ing-industrial', label: 'Ingeniería Industrial', categoria: 'Ingeniería' },
  { value: 'ing-mecanica', label: 'Ingeniería Mecánica', categoria: 'Ingeniería' },
  { value: 'ing-mecanica-industrial', label: 'Ingeniería Mecánica Industrial', categoria: 'Ingeniería' },
  { value: 'ing-mecatronica', label: 'Ingeniería Mecatrónica', categoria: 'Ingeniería' },
  { value: 'ing-quimica', label: 'Ingeniería Química', categoria: 'Ingeniería' },
  { value: 'ing-quimica-industrial', label: 'Ingeniería Química Industrial', categoria: 'Ingeniería' },

  // === BRIDGE BUSINESS SCHOOL ===
  { value: 'bridge-ciencia-administracion', label: 'Ing. en Ciencia de la Administración (Bridge)', categoria: 'Bridge Business School' },
  { value: 'bridge-administracion-empresas', label: 'Administración de Empresas', categoria: 'Bridge Business School' },
  { value: 'bridge-marketing-business', label: 'International Marketing and Business Analytics', categoria: 'Bridge Business School' },
  { value: 'bridge-comunicacion-estrategica', label: 'Comunicación Estratégica', categoria: 'Bridge Business School' },

  // === EDUCACIÓN ===
  { value: 'edu-musica', label: 'Profesorado en Educación Musical', categoria: 'Educación' },
  { value: 'edu-english', label: 'Profesorado en English Language Teaching (ELT)', categoria: 'Educación' },
  { value: 'edu-inclusiva', label: 'Profesorado en Educación Inclusiva', categoria: 'Educación' },
  { value: 'edu-primaria', label: 'Profesorado en Educación Primaria (Virtual)', categoria: 'Educación' },
  { value: 'edu-aprendizaje', label: 'Profesorado en Problemas del Aprendizaje', categoria: 'Educación' },
  { value: 'edu-matematica-fisica', label: 'Profesorado en Matemática y Ciencias Físicas', categoria: 'Educación' },
  { value: 'edu-quimica-biologia', label: 'Profesorado en Ciencias Químicas y Biológicas', categoria: 'Educación' },
  { value: 'edu-ciencias-sociales', label: 'Profesorado en Ciencias Sociales', categoria: 'Educación' },
  { value: 'edu-comunicacion-lenguaje', label: 'Profesorado en Comunicación y Lenguaje', categoria: 'Educación' },

  // === COLEGIO UNIVERSITARIO ===
  { value: 'cu-baccalaureatus-artibus', label: 'Baccalaureatus en Artibus', categoria: 'Colegio Universitario' },
  { value: 'cu-baccalaureatus-scientiis', label: 'Baccalaureatus en Scientiis', categoria: 'Colegio Universitario' },

  // === ARQUITECTURA ===
  { value: 'arquitectura', label: 'Arquitectura', categoria: 'Arquitectura' },

  // === CIENCIAS Y HUMANIDADES ===
  { value: 'biologia', label: 'Biología', categoria: 'Ciencias y Humanidades' },
  { value: 'bioquimica-microbiologia', label: 'Bioquímica y Microbiología', categoria: 'Ciencias y Humanidades' },
  { value: 'biotecnologia-molecular', label: 'Biotecnología Molecular', categoria: 'Ciencias y Humanidades' },
  { value: 'fisica', label: 'Física', categoria: 'Ciencias y Humanidades' },
  { value: 'matematica-aplicada', label: 'Matemática Aplicada', categoria: 'Ciencias y Humanidades' },
  { value: 'nutricion', label: 'Nutrición', categoria: 'Ciencias y Humanidades' },
  { value: 'quimica', label: 'Química', categoria: 'Ciencias y Humanidades' },
  { value: 'quimica-farmaceutica', label: 'Química Farmacéutica', categoria: 'Ciencias y Humanidades' },

  // === CIENCIAS SOCIALES ===
  { value: 'antropologia', label: 'Antropología', categoria: 'Ciencias Sociales' },
  { value: 'arqueologia', label: 'Arqueología', categoria: 'Ciencias Sociales' },
  { value: 'psicologia', label: 'Psicología', categoria: 'Ciencias Sociales' },
  { value: 'relaciones-internacionales', label: 'Relaciones Internacionales', categoria: 'Ciencias Sociales' },

  // === DESIGN INNOVATION & ARTS SCHOOL ===
  { value: 'composicion-produccion-musical', label: 'Composición y Producción Musical', categoria: 'Design Innovation & Arts' },
  { value: 'diseno-producto-innovacion', label: 'Diseño de Producto e Innovación', categoria: 'Design Innovation & Arts' },

  // === OPCIONES GENERALES ===
  { value: 'otra', label: 'Otra carrera', categoria: 'General' },
  { value: 'no-especificada', label: 'Prefiero no especificar', categoria: 'General' },
  { value: 'graduado', label: 'Ya soy graduado/a', categoria: 'General' },
  { value: 'maestria', label: 'Estudiante de Maestría', categoria: 'General' },
  { value: 'doctorado', label: 'Estudiante de Doctorado', categoria: 'General' },
  { value: 'prospecto', label: 'Prospecto/Interesado en estudiar', categoria: 'General' }
];

const TIPOS_INTERES = [
  { value: 'voluntario-campo', label: 'Voluntario en trabajo de campo', descripcion: 'Participar en actividades de conservación directa' },
  { value: 'investigacion', label: 'Apoyo en investigación', descripcion: 'Colaborar en estudios científicos del proyecto' },
  { value: 'divulgacion', label: 'Divulgación y educación ambiental', descripcion: 'Ayudar en actividades educativas y de concientización' },
  { value: 'monitoreo', label: 'Monitoreo ambiental', descripcion: 'Participar en el seguimiento de la calidad del agua y ecosistema' },
  { value: 'financiamiento', label: 'Apoyo financiero/donación', descripcion: 'Contribuir económicamente al proyecto' },
  { value: 'difusion', label: 'Difusión en redes sociales', descripcion: 'Ayudar a promocionar el proyecto digitalmente' },
  { value: 'fotografia-video', label: 'Fotografía y video', descripcion: 'Documentar visualmente las actividades' },
  { value: 'informacion', label: 'Solo quiero más información', descripcion: 'Conocer mejor el proyecto antes de decidir' },
  { value: 'otro', label: 'Otro tipo de colaboración', descripcion: 'Tengo una idea específica de cómo contribuir' }
];

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EMAIL_SEND_ERROR: 'EMAIL_SEND_ERROR', 
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  CONTACT_PROCESSING_ERROR: 'CONTACT_PROCESSING_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN'
};

export { CARRERAS_UVG, TIPOS_INTERES, HTTP_STATUS, ERROR_CODES };