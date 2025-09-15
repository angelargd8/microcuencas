'use client';
import Image from "next/image";
import styles from './navbar.module.css';
import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "./button";

const Navbar = ({className}) => {

  //para el menu hamburguesa
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  //manejo del scroll
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        setShowNavbar(true); // scrolling up
      } else {
        setShowNavbar(false); // scrolling down
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

    return (
      <div 
        className={`${styles.navbar} ${!showNavbar ? styles.hidden : ''} ${className}`}
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

        {/* Menú horizontal (desktop) */}
        <nav className={styles.menu}>
          <Link href="/">Inicio</Link>
          <Link href="/about">Acerca de</Link>
          <Link href="/galeria">Galería</Link>
          <Link href="/equipo">Equipo</Link>
          <Link href="/unirse">Unirse</Link>
        </nav>

        {/* Botón hamburguesa (móvil) */}
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Abrir menú">
          ☰
        </button>
        {menuOpen && (
          <div className={styles.dropdownMenu}>
            <Link href="/">Inicio</Link>
            <Link href="/about">Acerca de</Link>
            <Link href="/galeria">Galería</Link>
            <Link href="/equipo">Equipo</Link>
            <Link href="/unirse">Unirse</Link>
          </div>
        )}
      </div>
    );
  };
  
  export default Navbar;