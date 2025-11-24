'use client';

import { useState } from 'react';
import adminStyles from "../admin.module.css";
import '../../globals.css';
import Navbar from "../../components/navbar";

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Funcionalidad pendiente de implementar
    alert('Funcionalidad de registro pendiente de implementar');
  };

  return (
    <>
      <Navbar />

      <main className={adminStyles.authContainer}>
        <div className={adminStyles.authCard}>
          <div className={adminStyles.authHeader}>
            <div className={adminStyles.authIcon}>🔐</div>
            <h1 className={adminStyles.authTitle}>Registro de Administrador</h1>
            <p className={adminStyles.authSubtitle}>
              Crea una cuenta para gestionar el contenido del proyecto
            </p>
          </div>

          <form onSubmit={handleSubmit} className={adminStyles.authForm}>
            {/* Nombre Completo */}
            <div className={adminStyles.formGroup}>
              <label className={adminStyles.formLabel} htmlFor="nombre">
                Nombre Completo <span className={adminStyles.required}>*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={adminStyles.formInput}
                placeholder="Ej: Juan Carlos Perez"
                required
              />
            </div>

            {/* Email UVG */}
            <div className={adminStyles.formGroup}>
              <label className={adminStyles.formLabel} htmlFor="email">
                Correo Electrónico UVG <span className={adminStyles.required}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={adminStyles.formInput}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            {/* Contraseña */}
            <div className={adminStyles.formGroup}>
              <label className={adminStyles.formLabel} htmlFor="password">
                Contraseña <span className={adminStyles.required}>*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={adminStyles.formInput}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            {/* Confirmar Contraseña */}
            <div className={adminStyles.formGroup}>
              <label className={adminStyles.formLabel} htmlFor="confirmPassword">
                Confirmar Contraseña <span className={adminStyles.required}>*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={adminStyles.formInput}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className={adminStyles.submitButton}>
              Crear Cuenta de Administrador
            </button>

            {/* Security Notice */}
            <div className={adminStyles.securityNotice}>
              <p>
                <strong>Nota de seguridad:</strong> Solo el personal autorizado del proyecto puede crear una cuenta de administrador. Tu registro será revisado antes de ser aprobado.
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className={adminStyles.authFooter}>
            <p>¿Ya tienes una cuenta?</p>
            <a href="/admin/login">Iniciar sesión</a>
          </div>
        </div>
      </main>
    </>
  );
}
