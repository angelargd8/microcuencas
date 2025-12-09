'use client';
import Image from "next/image";
import styles from './navbar.module.css';
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import Button from "./button";

const Navbar = ({ className, isAdmin = false }) => {
  // estado para menus desplegables
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((v) => !v);
  const toggleAdmin = () => setAdminOpen((v) => !v);

  // manejo del scroll
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const pathname = usePathname();
  const isActive = (href) => pathname === href;

  return (
    <div
      className={`${styles.navbar} ${!showNavbar ? styles.hidden : ''} ${className || ''}`}
    >
      {/* Logo */}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <Image
          aria-hidden
          src="/uvg.svg"
          alt="UVG logo"
          width={90}
          height={40}
          priority
        />
      </a>

      {/* Menu horizontal (desktop) */}
      <nav className={styles.menu}>
        <Link className={isActive('/') ? styles.activeLink : ''} href="/">Inicio</Link>
        <Link className={isActive('/about') ? styles.activeLink : ''} href="/about">Acerca de</Link>
        <Link className={isActive('/vis') ? styles.activeLink : ''} href="/vis">Visualizacion</Link>
        <Link className={isActive('/galeria') ? styles.activeLink : ''} href="/galeria">Galeria</Link>
        <Link className={isActive('/timeline') ? styles.activeLink : ''} href="/timeline">Noticias</Link>
        <Link className={isActive('/unirse') ? styles.activeLink : ''} href="/unirse">Unirse</Link>
        <div className={styles.adminMenu}>
          <button
            type="button"
            className={styles.adminTrigger}
            aria-haspopup="true"
            aria-expanded={adminOpen}
            aria-label="Menu de cuenta"
            onClick={toggleAdmin}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-3.3137 3.134-6 7-6h2c3.866 0 7 2.6863 7 6" />
            </svg>
            <span>Login</span>
          </button>
          {adminOpen && (
            <div className={styles.adminDropdown} role="menu">
              <Link href="/admin/login" role="menuitem" className={isActive('/admin/login') ? styles.activeLink : ''}>Ingresar</Link>
              <Link href="/admin/register" role="menuitem" className={isActive('/admin/register') ? styles.activeLink : ''}>Registro</Link>
              <div className={styles.adminSeparator} />
              {isAdmin && (
                <Link href="/admin/crear-publicacion" role="menuitem" className={isActive('/admin/crear-publicacion') ? styles.activeLink : ''}>
                  Crear Publicacion
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Boton hamburguesa (movil) */}
      <button className={styles.hamburger} onClick={toggleMenu} aria-label="Abrir menu">
        <span aria-hidden="true">&#9776;</span>
      </button>
      {menuOpen && (
        <div className={styles.dropdownMenu}>
          <Link className={isActive('/') ? styles.activeLink : ''} href="/">Inicio</Link>
          <Link className={isActive('/about') ? styles.activeLink : ''} href="/about">Acerca de</Link>
          <Link className={isActive('/vis') ? styles.activeLink : ''} href="/vis">Visualizacion</Link>
          <Link className={isActive('/galeria') ? styles.activeLink : ''} href="/galeria">Galeria</Link>
          <Link className={isActive('/timeline') ? styles.activeLink : ''} href="/timeline">Noticias</Link>
          <Link className={isActive('/unirse') ? styles.activeLink : ''} href="/unirse">Unirse</Link>
          <Link className={isActive('/admin/login') ? styles.activeLink : ''} href="/admin/login">Login</Link>
          {isAdmin && (
            <Link className={isActive('/admin/crear-publicacion') ? styles.activeLink : ''} href="/admin/crear-publicacion">
              Crear Publicacion
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;

