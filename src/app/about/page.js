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
        <div className={aboutStyles.aboutGrid}>
          <div className={aboutStyles.aboutLeft}>
            <div className={aboutStyles.titleSection}>
              <h1 className={aboutStyles.header}>Acerca de Nosotros</h1>
              <p className={aboutStyles.description}>
                En &quot;Salva a la Microcuenca&quot;, somos un equipo apasionado de ecologistas, educadores y voluntarios 
                comprometidos con la conservación de nuestros recursos hídricos. Nuestra organización nace de la
                necesidad urgente de proteger las microcuencas, ecosistemas fundamentales que sustentan la vida en nuestra Tierra.
                Juntos, podemos marcar la diferencia y salvar nuestras microcuencas.
              </p>
            </div>
          </div>
          <div className={aboutStyles.aboutRight}>
            <div className={aboutStyles.section}>
              <h2 className={aboutStyles.sectionTitle}>Misión</h2>
              <p className={aboutStyles.sectionContent}>
                Impulsar proyectos, actividades y procesos educativos que 
                fortalezcan la conciencia ambiental y la acción comunitaria 
                en torno a la protección de las microcuencas. 
                Facilitamos la colaboración entre actores locales y promovemos prácticas 
                sostenibles que contribuyan al acceso a agua limpia y al cuidado de la biodiversidad.
              </p>
            </div>
            <div className={aboutStyles.section}>
              <h2 className={aboutStyles.sectionTitle}>Visión</h2>
              <p className={aboutStyles.sectionContent}>
                Proteger y restaurar las microcuencas mediante la educación, 
                la participación comunitaria y la implementación de prácticas sostenibles. 
                Aspiramos a garantizar el acceso a agua limpia y saludable, 
                promoviendo la biodiversidad y el equilibrio ecológico en nuestras comunidades.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}