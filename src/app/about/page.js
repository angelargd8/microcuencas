'use client';

import styles from "../page.module.css";
import aboutStyles from "./about.module.css";
import '../globals.css';
import Navbar from "../components/navbar";

export default function About() {
  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={`${styles.main} ${aboutStyles.aboutContainer}`}>
        <div className={aboutStyles.titleSection}>
          <h1 className={aboutStyles.header}>Acerca de Nosotros</h1>
          <p className={aboutStyles.description}>
            En "Salva a la Microcuenca", somos un equipo apasionado de ecologistas, educadores y voluntarios 
            comprometidos con la conservación de nuestros recursos hídricos. Nuestra organización nace de la
            necesidad urgente de proteger las microcuencas, ecosistemas fundamentales que sustentan la vida en nuestra Tierra.
            Juntos, podemos marcar la diferencia y salvar nuestras microcuencas.
          </p>
        </div>

        <div className={aboutStyles.section}>
          <h2 className={aboutStyles.sectionTitle}>Misión</h2>
          <p className={aboutStyles.sectionContent}>
            Nuestra misión es proteger y restaurar las microcuencas a través de la 
            educación, la participación comunitaria y la implementación de 
            prácticas sostenibles. Trabajamos para garantizar el acceso a agua 
            limpia y saludable, promoviendo la biodiversidad y el equilibrio 
            ecológico en nuestras comunidades.
          </p>
        </div>
          
        <div className={aboutStyles.section}>
          <h2 className={aboutStyles.sectionTitle}>Visión</h2>
          <p className={aboutStyles.sectionContent}>
            Nuestra visión es proteger y restaurar las microcuencas a través de la 
            educación, la participación comunitaria y la implementación de 
            prácticas sostenibles. Trabajamos para garantizar el acceso a agua 
            limpia y saludable, promoviendo la biodiversidad y el equilibrio 
            ecológico en nuestras comunidades.
          </p>
        </div>
      </main>
    </div>
  );
}