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
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={30}
            height={30}
          />
          
        </a>


        {/* Botón hamburguesa☰ */}
        <div >
          <Button
            text= {'☰'}
            location = {'navbar'}
            onClick={toggleMenu}
          />
          {menuOpen && (
            <div className={styles.dropdownMenu}>
              <Link href="/">Inicio</Link>
              <Link href="/about">Acerca de</Link>
              <Link href="/equipo">Equipo</Link>
              <Link href="/unirse">Unirse</Link>

            </div>
          )}

          {/* fin Botón hamburguesa☰ */}

        </div>


      </div>
    );
  };
  
  export default Navbar;