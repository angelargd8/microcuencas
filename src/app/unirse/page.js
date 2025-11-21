'use client';

import { useState } from 'react';
import styles from "../page.module.css";
import unirseStyles from "./unirse.module.css";
import '../globals.css';
import Navbar from "../components/navbar";

export default function Unirse() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    carrera: '',
    anioEstudio: '',
    tipoInteres: '',
    mensaje: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        // Limpiar formulario
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          carrera: '',
          anioEstudio: '',
          tipoInteres: '',
          mensaje: ''
        });
      } else {
        setSubmitStatus('error');
        console.error('Error del servidor:', data);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error enviando formulario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={`${styles.main} ${unirseStyles.unirseContainer}`}>
        {/* Header Section */}
        <div className={unirseStyles.headerSection}>
          <h1 className={unirseStyles.pageTitle}>Únete al Proyecto</h1>
          <p className={unirseStyles.pageSubtitle}>
            Se parte del cambio que nuestra comunidad necesita. Tu participación es fundamental
            para la conservación y restauración de la Microcuenca del Río Contreras.
          </p>
        </div>

        {/* Main Content */}
        <div className={unirseStyles.contentWrapper}>
          {/* Left Side - Information */}
          <div className={unirseStyles.infoSection}>
            <h2 className={unirseStyles.infoTitle}>¿Por qué unirte?</h2>
            <p className={unirseStyles.infoText}>
              Al unirte a nuestro proyecto, formarás parte de una comunidad comprometida
              con la protección de nuestros recursos hídricos y el medio ambiente.
            </p>

            <ul className={unirseStyles.benefitsList}>
              <li className={unirseStyles.benefitItem}>
                <div className={unirseStyles.benefitIcon}>1</div>
                <div className={unirseStyles.benefitContent}>
                  <div className={unirseStyles.benefitTitle}>Impacto Real</div>
                  <div className={unirseStyles.benefitDescription}>
                    Contribuye directamente a la restauración de ecosistemas vitales
                  </div>
                </div>
              </li>

              <li className={unirseStyles.benefitItem}>
                <div className={unirseStyles.benefitIcon}>2</div>
                <div className={unirseStyles.benefitContent}>
                  <div className={unirseStyles.benefitTitle}>Desarrollo Profesional</div>
                  <div className={unirseStyles.benefitDescription}>
                    Adquiere experiencia práctica en conservación ambiental
                  </div>
                </div>
              </li>

              <li className={unirseStyles.benefitItem}>
                <div className={unirseStyles.benefitIcon}>3</div>
                <div className={unirseStyles.benefitContent}>
                  <div className={unirseStyles.benefitTitle}>Comunidad</div>
                  <div className={unirseStyles.benefitDescription}>
                    Conecta con personas apasionadas por el medio ambiente
                  </div>
                </div>
              </li>

              <li className={unirseStyles.benefitItem}>
                <div className={unirseStyles.benefitIcon}>4</div>
                <div className={unirseStyles.benefitContent}>
                  <div className={unirseStyles.benefitTitle}>Educación</div>
                  <div className={unirseStyles.benefitDescription}>
                    Aprende sobre ecosistemas acuáticos y prácticas sostenibles
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Side - Form */}
          <div className={unirseStyles.formSection}>
            <h2 className={unirseStyles.formTitle}>Formulario de Inscripción</h2>
            <p className={unirseStyles.formDescription}>
              Completa el siguiente formulario y nos pondremos en contacto contigo en un plazo de 3-5 días hábiles.
            </p>

            <form onSubmit={handleSubmit} className={unirseStyles.form}>
              {/* Mensaje de éxito */}
              {submitStatus === 'success' && (
                <div className={unirseStyles.successMessage}>
                  <strong>Solicitud enviada exitosamente</strong>
                  <p>Gracias por tu interés. Te contactaremos en un plazo de 3-5 días hábiles. Revisa tu email para ver la confirmación.</p>
                </div>
              )}

              {/* Mensaje de error */}
              {submitStatus === 'error' && (
                <div className={unirseStyles.errorMessage}>
                  <strong>Error al enviar el formulario</strong>
                  <p>Hubo un problema al procesar tu solicitud. Por favor, intenta nuevamente o contáctanos directamente.</p>
                </div>
              )}

              {/* Nombre Completo */}
              <div className={unirseStyles.formGroup}>
                <label className={unirseStyles.formLabel} htmlFor="nombre">
                  Nombre Completo <span className={unirseStyles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={unirseStyles.formInput}
                  placeholder="Ej: Juan Carlos Pérez"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email y Teléfono */}
              <div className={unirseStyles.formRow}>
                <div className={unirseStyles.formGroup}>
                  <label className={unirseStyles.formLabel} htmlFor="email">
                    Correo Electrónico <span className={unirseStyles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={unirseStyles.formInput}
                    placeholder="correo@ejemplo.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className={unirseStyles.formGroup}>
                  <label className={unirseStyles.formLabel} htmlFor="telefono">
                    Teléfono <span className={unirseStyles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={unirseStyles.formInput}
                    placeholder="1234-5678"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Carrera y Año de Estudio */}
              <div className={unirseStyles.formRow}>
                <div className={unirseStyles.formGroup}>
                  <label className={unirseStyles.formLabel} htmlFor="carrera">
                    Carrera / Profesión <span className={unirseStyles.required}>*</span>
                  </label>
                  <select
                    id="carrera"
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleChange}
                    className={unirseStyles.formSelect}
                    required
                    disabled={loading}
                  >
                    <option value="">Selecciona tu carrera</option>

                    <optgroup label="Ingeniería">
                      <option value="ing-biomedica">Ingeniería Biomédica</option>
                      <option value="ing-biotecnologia-industrial">Ingeniería en Biotecnología Industrial</option>
                      <option value="ing-ciencia-administracion">Ingeniería en Ciencia de la Administración</option>
                      <option value="ing-ciencias-alimentos">Ingeniería en Ciencias de Alimentos</option>
                      <option value="ing-ciencias-alimentos-industrial">Ingeniería en Ciencias de Alimentos Industrial</option>
                      <option value="ing-civil">Ingeniería Civil</option>
                      <option value="ing-civil-arquitectonica">Ingeniería Civil Arquitectónica</option>
                      <option value="ing-ciencia-computacion">Ingeniería en Ciencia de la Computación y TI</option>
                      <option value="ing-sistemas-informacion">Ingeniería en Sistemas de Información Computacional</option>
                      <option value="ing-electronica">Ingeniería Electrónica</option>
                      <option value="ing-industrial">Ingeniería Industrial</option>
                      <option value="ing-mecanica">Ingeniería Mecánica</option>
                      <option value="ing-mecanica-industrial">Ingeniería Mecánica Industrial</option>
                      <option value="ing-mecatronica">Ingeniería Mecatrónica</option>
                      <option value="ing-quimica">Ingeniería Química</option>
                      <option value="ing-quimica-industrial">Ingeniería Química Industrial</option>
                    </optgroup>

                    <optgroup label="Bridge Business School">
                      <option value="bridge-ciencia-administracion">Ing. en Ciencia de la Administración (Bridge)</option>
                      <option value="bridge-administracion-empresas">Administración de Empresas</option>
                      <option value="bridge-marketing-business">International Marketing and Business Analytics</option>
                      <option value="bridge-comunicacion-estrategica">Comunicación Estratégica</option>
                    </optgroup>

                    <optgroup label="Educación">
                      <option value="edu-musica">Profesorado en Educación Musical</option>
                      <option value="edu-english">Profesorado en English Language Teaching (ELT)</option>
                      <option value="edu-inclusiva">Profesorado en Educación Inclusiva</option>
                      <option value="edu-primaria">Profesorado en Educación Primaria (Virtual)</option>
                      <option value="edu-aprendizaje">Profesorado en Problemas del Aprendizaje</option>
                      <option value="edu-matematica-fisica">Profesorado en Matemática y Ciencias Físicas</option>
                      <option value="edu-quimica-biologia">Profesorado en Ciencias Químicas y Biológicas</option>
                      <option value="edu-ciencias-sociales">Profesorado en Ciencias Sociales</option>
                      <option value="edu-comunicacion-lenguaje">Profesorado en Comunicación y Lenguaje</option>
                    </optgroup>

                    <optgroup label="Colegio Universitario">
                      <option value="cu-baccalaureatus-artibus">Baccalaureatus en Artibus</option>
                      <option value="cu-baccalaureatus-scientiis">Baccalaureatus en Scientiis</option>
                    </optgroup>

                    <optgroup label="Arquitectura">
                      <option value="arquitectura">Arquitectura</option>
                    </optgroup>

                    <optgroup label="Ciencias y Humanidades">
                      <option value="biologia">Biología</option>
                      <option value="bioquimica-microbiologia">Bioquímica y Microbiología</option>
                      <option value="biotecnologia-molecular">Biotecnología Molecular</option>
                      <option value="fisica">Física</option>
                      <option value="matematica-aplicada">Matemática Aplicada</option>
                      <option value="nutricion">Nutrición</option>
                      <option value="quimica">Química</option>
                      <option value="quimica-farmaceutica">Química Farmacéutica</option>
                    </optgroup>

                    <optgroup label="Ciencias Sociales">
                      <option value="antropologia">Antropología</option>
                      <option value="arqueologia">Arqueología</option>
                      <option value="psicologia">Psicología</option>
                      <option value="relaciones-internacionales">Relaciones Internacionales</option>
                    </optgroup>

                    <optgroup label="Design Innovation & Arts">
                      <option value="composicion-produccion-musical">Composición y Producción Musical</option>
                      <option value="diseno-producto-innovacion">Diseño de Producto e Innovación</option>
                    </optgroup>

                    <optgroup label="Otras opciones">
                      <option value="otra">Otra carrera</option>
                      <option value="no-especificada">Prefiero no especificar</option>
                      <option value="graduado">Ya soy graduado/a</option>
                      <option value="maestria">Estudiante de Maestría</option>
                      <option value="doctorado">Estudiante de Doctorado</option>
                      <option value="prospecto">Prospecto/Interesado en estudiar</option>
                    </optgroup>
                  </select>
                </div>

                <div className={unirseStyles.formGroup}>
                  <label className={unirseStyles.formLabel} htmlFor="anioEstudio">
                    Año de Estudio <span className={unirseStyles.required}>*</span>
                  </label>
                  <select
                    id="anioEstudio"
                    name="anioEstudio"
                    value={formData.anioEstudio}
                    onChange={handleChange}
                    className={unirseStyles.formSelect}
                    required
                    disabled={loading}
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="1">Primer año</option>
                    <option value="2">Segundo año</option>
                    <option value="3">Tercer año</option>
                    <option value="4">Cuarto año</option>
                    <option value="5">Quinto año</option>
                    <option value="graduado">Graduado</option>
                    <option value="maestria">Maestría</option>
                    <option value="doctorado">Doctorado</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              {/* Tipo de Interés */}
              <div className={unirseStyles.formGroup}>
                <label className={unirseStyles.formLabel} htmlFor="tipoInteres">
                  Tipo de Interés <span className={unirseStyles.required}>*</span>
                </label>
                <select
                  id="tipoInteres"
                  name="tipoInteres"
                  value={formData.tipoInteres}
                  onChange={handleChange}
                  className={unirseStyles.formSelect}
                  required
                  disabled={loading}
                >
                  <option value="">¿Cómo te gustaría participar?</option>
                  <option value="voluntario-campo">Voluntario - Trabajo de Campo</option>
                  <option value="investigacion">Investigación Científica</option>
                  <option value="divulgacion">Divulgación y Educación</option>
                  <option value="monitoreo">Monitoreo Ambiental</option>
                  <option value="financiamiento">Apoyo Financiero</option>
                  <option value="difusion">Difusión en Redes Sociales</option>
                  <option value="fotografia-video">Fotografía y Video</option>
                  <option value="informacion">Solo información</option>
                  <option value="otro">Otro</option>
                </select>

                <div className={unirseStyles.interestInfo}>
                  <div className={unirseStyles.interestInfoTitle}>Opciones disponibles:</div>
                  <ul className={unirseStyles.interestInfoList}>
                    <li><strong>Trabajo de Campo:</strong> Actividades de reforestación y monitoreo</li>
                    <li><strong>Investigación:</strong> Proyectos científicos y análisis de datos</li>
                    <li><strong>Divulgación:</strong> Talleres educativos y eventos comunitarios</li>
                    <li><strong>Tesis/Prácticas:</strong> Desarrollo de proyectos académicos</li>
                  </ul>
                </div>
              </div>

              {/* Mensaje */}
              <div className={unirseStyles.formGroup}>
                <label className={unirseStyles.formLabel} htmlFor="mensaje">
                  Cuéntanos más sobre tu interés
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  className={unirseStyles.formTextarea}
                  placeholder="¿Qué te motiva a unirte? ¿Tienes experiencia previa en proyectos ambientales? ¿Cuánto tiempo puedes dedicar?"
                  disabled={loading}
                ></textarea>
                <div className={unirseStyles.helperText}>Este campo es opcional pero nos ayuda a conocerte mejor</div>
              </div>

              {/* Submit Button */}
              <button type="submit" className={unirseStyles.submitButton} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>

              {/* Privacy Notice */}
              <div className={unirseStyles.privacyNotice}>
                <p>
                  <strong>Protección de datos:</strong> Tu información será utilizada únicamente
                  para contactarte sobre tu participación en el proyecto. No compartiremos tus
                  datos con terceros. Al enviar este formulario, aceptas que te contactemos
                  por email o teléfono.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
