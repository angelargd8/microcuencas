'use client';

import { useState } from 'react';
import adminStyles from "../admin.module.css";
import '../../globals.css';
import Navbar from "../../components/navbar";
import Link from 'next/link';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Funcionalidad pendiente de implementar
    alert('Funcionalidad de login pendiente de implementar');
  };

  return (
    <>
      <Navbar />

      <main className={adminStyles.authContainer}>
        <div className={adminStyles.authCard}>
          <div className={adminStyles.authHeader}>
            <div className={adminStyles.authIcon}>🔑</div>
            <h1 className={adminStyles.authTitle}>Acceso Administrativo</h1>
            <p className={adminStyles.authSubtitle}>
              Inicia sesión para gestionar el contenido del proyecto
            </p>
          </div>

          <form onSubmit={handleSubmit} className={adminStyles.authForm}>
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

            {/* Remember & Forgot */}
            <div className={adminStyles.formOptions}>
              <div className={adminStyles.rememberMe}>
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <label htmlFor="remember">Recordarme</label>
              </div>
              <a href="#" className={adminStyles.forgotPassword}>¿Olvidaste tu contraseña?</a>
            </div>
            {/* Submit Button */}
            <button type="submit" className={adminStyles.submitButton}>
              Iniciar Sesión
            </button>

            {/* Quick Access */}
            <div className={adminStyles.quickAccess}>
              <div className={adminStyles.quickAccessTitle}>Acceso rápido al sitio:</div>
              <div className={adminStyles.quickAccessLinks}>
                <Link href="/" className={adminStyles.quickLink}>
                Página Principal
                </Link>
                <a href="/about" className={adminStyles.quickLink}>Acerca del Proyecto</a>
                <a href="/unirse" className={adminStyles.quickLink}>Unirse</a>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className={adminStyles.authFooter}>
            <p>¿No tienes una cuenta de administrador?</p>
            <a href="/admin/register">Solicitar acceso</a>
          </div>
        </div>
      </main>
    </>
  );
}
