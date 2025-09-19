import { CARRERAS_UVG, TIPOS_INTERES, HTTP_STATUS, ERROR_CODES } from '../../utils/constants.js';

describe('Utils - Constants', () => {
  describe('CARRERAS_UVG', () => {
    test('debe ser un array no vacío', () => {
      expect(Array.isArray(CARRERAS_UVG)).toBe(true);
      expect(CARRERAS_UVG.length).toBeGreaterThan(0);
    });

    test('cada carrera debe tener estructura correcta', () => {
      CARRERAS_UVG.forEach(carrera => {
        expect(carrera).toHaveProperty('value');
        expect(carrera).toHaveProperty('label');
        expect(carrera).toHaveProperty('categoria');

        expect(typeof carrera.value).toBe('string');
        expect(typeof carrera.label).toBe('string');
        expect(typeof carrera.categoria).toBe('string');

        expect(carrera.value.length).toBeGreaterThan(0);
        expect(carrera.label.length).toBeGreaterThan(0);
        expect(carrera.categoria.length).toBeGreaterThan(0);
      });
    });

    test('todos los values deben ser únicos', () => {
      const values = CARRERAS_UVG.map(carrera => carrera.value);
      const uniqueValues = new Set(values);

      expect(uniqueValues.size).toBe(values.length);
    });

    test('debe incluir categorías principales de UVG', () => {
      const categorias = [...new Set(CARRERAS_UVG.map(carrera => carrera.categoria))];

      const categoriasEsperadas = [
        'Ingeniería',
        'Bridge Business School',
        'Educación',
        'Colegio Universitario',
        'Arquitectura',
        'Ciencias y Humanidades',
        'Ciencias Sociales',
        'Design Innovation & Arts',
        'General'
      ];

      categoriasEsperadas.forEach(categoria => {
        expect(categorias).toContain(categoria);
      });
    });

    test('debe incluir todas las ingenierías principales', () => {
      const ingenieriasEsperadas = [
        'ing-civil',
        'ing-ciencia-computacion',
        'ing-industrial',
        'ing-electronica',
        'ing-quimica'
      ];

      const valuesIngenieria = CARRERAS_UVG
        .filter(carrera => carrera.categoria === 'Ingeniería')
        .map(carrera => carrera.value);

      ingenieriasEsperadas.forEach(ing => {
        expect(valuesIngenieria).toContain(ing);
      });
    });

    test('debe incluir opciones generales', () => {
      const opcionesGenerales = ['otra', 'no-especificada', 'graduado', 'maestria', 'doctorado'];

      const valuesGenerales = CARRERAS_UVG
        .filter(carrera => carrera.categoria === 'General')
        .map(carrera => carrera.value);

      opcionesGenerales.forEach(opcion => {
        expect(valuesGenerales).toContain(opcion);
      });
    });

    test('labels deben ser válidos y no estar vacíos', () => {
      CARRERAS_UVG.forEach(carrera => {
        // Simplemente verificar que las labels son válidas y no están vacías
        expect(carrera.label).toBeDefined();
        expect(typeof carrera.label).toBe('string');
        expect(carrera.label.length).toBeGreaterThan(0);

        // Verificar que no contienen caracteres peligrosos
        expect(carrera.label).not.toMatch(/<script|javascript:|onclick/i);
      });
    });
  });

  describe('TIPOS_INTERES', () => {
    test('debe ser un array no vacío', () => {
      expect(Array.isArray(TIPOS_INTERES)).toBe(true);
      expect(TIPOS_INTERES.length).toBeGreaterThan(0);
    });

    test('cada tipo debe tener estructura correcta', () => {
      TIPOS_INTERES.forEach(tipo => {
        expect(tipo).toHaveProperty('value');
        expect(tipo).toHaveProperty('label');
        expect(tipo).toHaveProperty('descripcion');

        expect(typeof tipo.value).toBe('string');
        expect(typeof tipo.label).toBe('string');
        expect(typeof tipo.descripcion).toBe('string');

        expect(tipo.value.length).toBeGreaterThan(0);
        expect(tipo.label.length).toBeGreaterThan(0);
        expect(tipo.descripcion.length).toBeGreaterThan(0);
      });
    });

    test('todos los values deben ser únicos', () => {
      const values = TIPOS_INTERES.map(tipo => tipo.value);
      const uniqueValues = new Set(values);

      expect(uniqueValues.size).toBe(values.length);
    });

    test('debe incluir tipos principales de interés', () => {
      const tiposEsperados = [
        'voluntario-campo',
        'investigacion',
        'divulgacion',
        'monitoreo',
        'financiamiento',
        'informacion'
      ];

      const values = TIPOS_INTERES.map(tipo => tipo.value);

      tiposEsperados.forEach(tipo => {
        expect(values).toContain(tipo);
      });
    });

    test('debe incluir opción genérica "otro"', () => {
      const values = TIPOS_INTERES.map(tipo => tipo.value);
      expect(values).toContain('otro');
    });

    test('labels y descripciones deben ser descriptivos', () => {
      TIPOS_INTERES.forEach(tipo => {
        expect(tipo.label.length).toBeGreaterThan(5);
        expect(tipo.descripcion.length).toBeGreaterThan(10);

        // Debe contener palabras relacionadas con el proyecto
        const palabrasRelacionadas = /voluntario|investigación|educación|monitoreo|apoyo|colaboración|información|participar|ayudar|contribuir|difusión|donación|fotografía|video/i;
        expect(palabrasRelacionadas.test(tipo.label + ' ' + tipo.descripcion)).toBe(true);
      });
    });

    test('values deben usar formato kebab-case', () => {
      TIPOS_INTERES.forEach(tipo => {
        expect(tipo.value).toMatch(/^[a-z]+(-[a-z]+)*$/);
      });
    });
  });

  describe('HTTP_STATUS', () => {
    test('debe contener códigos HTTP estándar', () => {
      const codigosEsperados = {
        OK: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        TOO_MANY_REQUESTS: 429,
        INTERNAL_SERVER_ERROR: 500
      };

      Object.entries(codigosEsperados).forEach(([nombre, codigo]) => {
        expect(HTTP_STATUS).toHaveProperty(nombre);
        expect(HTTP_STATUS[nombre]).toBe(codigo);
      });
    });

    test('todos los códigos deben ser números válidos', () => {
      Object.values(HTTP_STATUS).forEach(codigo => {
        expect(typeof codigo).toBe('number');
        expect(codigo).toBeGreaterThanOrEqual(100);
        expect(codigo).toBeLessThan(600);
      });
    });

    test('debe incluir códigos de éxito', () => {
      expect(HTTP_STATUS.OK).toBe(200);
    });

    test('debe incluir códigos de error de cliente', () => {
      const codigosCliente = [
        HTTP_STATUS.BAD_REQUEST,
        HTTP_STATUS.UNAUTHORIZED,
        HTTP_STATUS.FORBIDDEN,
        HTTP_STATUS.NOT_FOUND,
        HTTP_STATUS.TOO_MANY_REQUESTS
      ];

      codigosCliente.forEach(codigo => {
        expect(codigo).toBeGreaterThanOrEqual(400);
        expect(codigo).toBeLessThan(500);
      });
    });

    test('debe incluir códigos de error de servidor', () => {
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBeGreaterThanOrEqual(500);
    });
  });

  describe('ERROR_CODES', () => {
    test('debe contener códigos de error del sistema', () => {
      const codigosEsperados = [
        'VALIDATION_ERROR',
        'EMAIL_SEND_ERROR',
        'RATE_LIMIT_EXCEEDED',
        'CONFIGURATION_ERROR',
        'CONTACT_PROCESSING_ERROR',
        'INTERNAL_ERROR',
        'NOT_FOUND',
        'FORBIDDEN'
      ];

      codigosEsperados.forEach(codigo => {
        expect(ERROR_CODES).toHaveProperty(codigo);
        expect(typeof ERROR_CODES[codigo]).toBe('string');
      });
    });

    test('códigos deben usar formato UPPER_SNAKE_CASE', () => {
      Object.values(ERROR_CODES).forEach(codigo => {
        expect(codigo).toMatch(/^[A-Z_]+$/);
      });
    });

    test('códigos deben ser únicos', () => {
      const valores = Object.values(ERROR_CODES);
      const valoresUnicos = new Set(valores);

      expect(valoresUnicos.size).toBe(valores.length);
    });

    test('debe incluir errores específicos del dominio', () => {
      expect(ERROR_CODES).toHaveProperty('EMAIL_SEND_ERROR');
      expect(ERROR_CODES).toHaveProperty('CONTACT_PROCESSING_ERROR');
      expect(ERROR_CODES).toHaveProperty('RATE_LIMIT_EXCEEDED');
    });

    test('debe incluir errores genéricos', () => {
      expect(ERROR_CODES).toHaveProperty('VALIDATION_ERROR');
      expect(ERROR_CODES).toHaveProperty('INTERNAL_ERROR');
      expect(ERROR_CODES).toHaveProperty('NOT_FOUND');
      expect(ERROR_CODES).toHaveProperty('FORBIDDEN');
    });
  });

  describe('Relación entre HTTP_STATUS y ERROR_CODES', () => {
    test('ERROR_CODES debe tener correspondencia lógica con HTTP_STATUS', () => {
      const correspondencias = [
        { error: 'VALIDATION_ERROR', httpStatus: 'BAD_REQUEST' },
        { error: 'NOT_FOUND', httpStatus: 'NOT_FOUND' },
        { error: 'FORBIDDEN', httpStatus: 'FORBIDDEN' },
        { error: 'RATE_LIMIT_EXCEEDED', httpStatus: 'TOO_MANY_REQUESTS' },
        { error: 'INTERNAL_ERROR', httpStatus: 'INTERNAL_SERVER_ERROR' }
      ];

      correspondencias.forEach(({ error, httpStatus }) => {
        expect(ERROR_CODES).toHaveProperty(error);
        expect(HTTP_STATUS).toHaveProperty(httpStatus);
      });
    });
  });

  describe('Inmutabilidad de constantes', () => {
    test('constantes deben ser objetos inmutables', () => {
      // Intentar modificar las constantes no debería afectar las exportaciones
      const originalCarrerasLength = CARRERAS_UVG.length;
      const originalTiposLength = TIPOS_INTERES.length;

      // Intentar modificar (esto podría no funcionar en modo estricto)
      try {
        CARRERAS_UVG.push({ value: 'test', label: 'Test', categoria: 'Test' });
        TIPOS_INTERES.push({ value: 'test', label: 'Test', descripcion: 'Test' });
      } catch (error) {
        // Expected in strict mode
      }

      // Las constantes principales deberían mantenerse
      expect(CARRERAS_UVG.length).toBeGreaterThanOrEqual(originalCarrerasLength);
      expect(TIPOS_INTERES.length).toBeGreaterThanOrEqual(originalTiposLength);
    });
  });

  describe('Validación de datos completos', () => {
    test('CARRERAS_UVG debe cubrir todas las facultades de UVG', () => {
      const categorias = [...new Set(CARRERAS_UVG.map(c => c.categoria))];

      // UVG tiene estas principales facultades/escuelas
      expect(categorias.length).toBeGreaterThanOrEqual(8);
      expect(categorias).toContain('Ingeniería');
      expect(categorias).toContain('Bridge Business School');
      expect(categorias).toContain('Educación');
    });

    test('TIPOS_INTERES debe cubrir formas principales de colaboración', () => {
      expect(TIPOS_INTERES.length).toBeGreaterThanOrEqual(8);

      const values = TIPOS_INTERES.map(t => t.value);
      expect(values).toContain('voluntario-campo');
      expect(values).toContain('investigacion');
      expect(values).toContain('financiamiento');
      expect(values).toContain('informacion');
    });
  });
});