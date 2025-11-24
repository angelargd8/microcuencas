'use client';

import { useState } from 'react';
import postStyles from "./post.module.css";
import '../../globals.css';
import Navbar from "../../components/navbar";

export default function CrearPublicacion() {
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    contenido: '',
    imagen: null,
    etiquetas: [],
    categoria: '',
    fechaEvento: '',
    estado: 'publicado'
  });

  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imagen: file
      }));

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim() && !formData.etiquetas.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          etiquetas: [...prev.etiquetas, tagInput.trim()]
        }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      etiquetas: prev.etiquetas.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCategoryClick = (categoria) => {
    setFormData(prev => ({
      ...prev,
      categoria: categoria
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Funcionalidad pendiente de implementar
    console.log('Datos del formulario:', formData);
    alert('Funcionalidad de publicación pendiente de implementar');
  };

  return (
    <>
      <Navbar />

      <main className={postStyles.container}>
        {/* Header */}
        <div className={postStyles.header}>
          <h1 className={postStyles.pageTitle}>Crear Nueva Publicación</h1>
          <p className={postStyles.pageSubtitle}>
            Se parte del cambio que nuestra comunidad necesita. Tu participación es fundamental para la conservación y restauración de la Microcuenca del Río Contreras.
          </p>
        </div>

        {/* Content Grid */}
        <div className={postStyles.contentGrid}>
          {/* Main Form */}
          <div className={postStyles.formSection}>
            <form onSubmit={handleSubmit}>
              {/* Título */}
              <div className={postStyles.formGroup}>
                <label className={postStyles.formLabel} htmlFor="titulo">
                  Título de la Publicación <span className={postStyles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className={postStyles.formInput}
                  placeholder="Ej: Titulo de la publicación sobre la microcuenca"
                  required
                />
                <div className={postStyles.helperText}>Máximo de 100 caracteres</div>
              </div>

              {/* Resumen */}
              <div className={postStyles.formGroup}>
                <label className={postStyles.formLabel} htmlFor="resumen">
                  Resumen <span className={postStyles.required}>*</span>
                </label>
                <textarea
                  id="resumen"
                  name="resumen"
                  value={formData.resumen}
                  onChange={handleChange}
                  className={postStyles.formTextarea}
                  placeholder="correo@ejemplo.com"
                  rows="4"
                  required
                ></textarea>
                <div className={postStyles.helperText}>
                  Breve descripción que aparecerá en la vista previa (150-200 caracteres)
                </div>
              </div>

              {/* Contenido Completo */}
              <div className={postStyles.formGroup}>
                <label className={postStyles.formLabel} htmlFor="contenido">
                  Contenido Completo <span className={postStyles.required}>*</span>
                </label>
                <textarea
                  id="contenido"
                  name="contenido"
                  value={formData.contenido}
                  onChange={handleChange}
                  className={`${postStyles.formTextarea} ${postStyles.textareaLarge}`}
                  placeholder="Contenido de la publicación..."
                  rows="10"
                  required
                ></textarea>
              </div>

              {/* Imagen Principal */}
              <div className={postStyles.formGroup}>
                <label className={postStyles.formLabel}>
                  Imagen Principal <span className={postStyles.required}>*</span>
                </label>
                <label htmlFor="imagen" className={postStyles.imageUpload}>
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    required
                  />
                  {!imagePreview ? (
                    <>
                      <div className={postStyles.uploadIcon}>📷</div>
                      <div className={postStyles.uploadText}>Click para subir imagen</div>
                      <div className={postStyles.uploadHint}>PNG, JPG o WEBP (máximo 5MB)</div>
                    </>
                  ) : (
                    <div className={postStyles.imagePreview}>
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </label>
              </div>

              {/* Etiquetas */}
              <div className={postStyles.formGroup}>
                <label className={postStyles.formLabel}>Etiquetas</label>
                <div className={postStyles.tagsContainer}>
                  {formData.etiquetas.map((tag, index) => (
                    <span key={index} className={postStyles.tag}>
                      {tag}
                      <span
                        className={postStyles.tagRemove}
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </span>
                    </span>
                  ))}
                  <input
                    type="text"
                    className={postStyles.tagInput}
                    placeholder="Escribe una etiqueta y presiona Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                </div>
                <div className={postStyles.helperText}>
                  Agrega palabras clave para facilitar la búsqueda
                </div>
              </div>

              {/* Categoría */}
              <div className={postStyles.formGroup}>
                <label className={postStyles.formLabel}>
                  Categoría <span className={postStyles.required}>*</span>
                </label>
                <div className={postStyles.categoryChips}>
                  <button
                    type="button"
                    className={`${postStyles.categoryChip} ${formData.categoria === 'noticia' ? postStyles.active : ''}`}
                    onClick={() => handleCategoryClick('noticia')}
                  >
                    Noticia
                  </button>
                  <button
                    type="button"
                    className={`${postStyles.categoryChip} ${formData.categoria === 'evento' ? postStyles.active : ''}`}
                    onClick={() => handleCategoryClick('evento')}
                  >
                    Evento
                  </button>
                  <button
                    type="button"
                    className={`${postStyles.categoryChip} ${formData.categoria === 'logro' ? postStyles.active : ''}`}
                    onClick={() => handleCategoryClick('logro')}
                  >
                    Logro
                  </button>
                  <button
                    type="button"
                    className={`${postStyles.categoryChip} ${formData.categoria === 'investigacion' ? postStyles.active : ''}`}
                    onClick={() => handleCategoryClick('investigacion')}
                  >
                    Investigación
                  </button>
                  <button
                    type="button"
                    className={`${postStyles.categoryChip} ${formData.categoria === 'educacion' ? postStyles.active : ''}`}
                    onClick={() => handleCategoryClick('educacion')}
                  >
                    Educación
                  </button>
                </div>
              </div>

              {/* Fecha del Evento */}
              <div className={postStyles.formGroup}>
                <label className={postStyles.formLabel} htmlFor="fechaEvento">
                  Fecha del Evento (opcional)
                </label>
                <input
                  type="date"
                  id="fechaEvento"
                  name="fechaEvento"
                  value={formData.fechaEvento}
                  onChange={handleChange}
                  className={postStyles.formInput}
                />
                <div className={postStyles.helperText}>
                  Si la publicación es sobre un evento, indica la fecha
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className={postStyles.sidebar}>
            {/* Acciones */}
            <div className={postStyles.sidebarCard}>
              <h3 className={postStyles.sidebarTitle}>Acciones</h3>
              <div className={postStyles.actionButtons}>
                <button
                  type="submit"
                  form="postForm"
                  onClick={handleSubmit}
                  className={`${postStyles.btn} ${postStyles.btnPrimary}`}
                >
                  Publicar Ahora
                </button>
                <button type="button" className={`${postStyles.btn} ${postStyles.btnSecondary}`}>
                  Guardar Borrador
                </button>
                <button type="button" className={`${postStyles.btn} ${postStyles.btnOutline}`}>
                  Vista Previa
                </button>
              </div>
            </div>

            {/* Estado de Publicación */}
            <div className={postStyles.sidebarCard}>
              <h3 className={postStyles.sidebarTitle}>Estado de Publicación</h3>
              <div className={postStyles.statusOptions}>
                <label className={postStyles.statusOption}>
                  <input
                    type="radio"
                    name="estado"
                    value="publicado"
                    checked={formData.estado === 'publicado'}
                    onChange={handleChange}
                  />
                  <div>
                    <div className={postStyles.statusLabel}>Publicado</div>
                    <div className={postStyles.statusDescription}>Visible para todos</div>
                  </div>
                </label>
                <label className={postStyles.statusOption}>
                  <input
                    type="radio"
                    name="estado"
                    value="borrador"
                    checked={formData.estado === 'borrador'}
                    onChange={handleChange}
                  />
                  <div>
                    <div className={postStyles.statusLabel}>Borrador</div>
                    <div className={postStyles.statusDescription}>Solo visible para administradores</div>
                  </div>
                </label>
                <label className={postStyles.statusOption}>
                  <input
                    type="radio"
                    name="estado"
                    value="programado"
                    checked={formData.estado === 'programado'}
                    onChange={handleChange}
                  />
                  <div>
                    <div className={postStyles.statusLabel}>Programado</div>
                    <div className={postStyles.statusDescription}>Publicar en fecha específica</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
