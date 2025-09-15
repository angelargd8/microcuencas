'use client';
import Image from "next/image";
import styles from "./page.module.css";
import Button from "./components/button";
import './globals.css';
import Navbar from "./components/navbar";
import LandingTextfield from "./components/textfield";


export default function Home() {

  return (
    <div className={styles.page}>

      <div className="styles.landingImage">
          <Image
            src="/img/landing/landingPic2Mobile.JPG"
            alt="Microcuenca Rio Contreras"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.overlay} />

      {/* INICIO DEL CONTENIDO DENTRO D LA IMAGEN DE FONDO */}
      <main className={styles.main}>

        

        <Navbar className={styles.navbar}  />
        
        <div className={styles.landingTextfield}>
          <LandingTextfield
            title= {'SALVA A LA MICROCUENCA'}
            text= {'Unámonos para restaurar la salud de nuestros ríos y arroyos, promoviendo prácticas responsables en el uso del agua y la reforestación. Con tu apoyo, podemos asegurar un futuro más limpio y saludable para nuestra comunidad y el planeta. ¡Actúa ahora y sé parte del cambio!'}
            location = {'landingPage'}
          />

        </div>

        <div className={styles.ctas}>

             
        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', marginLeft: '10px', marginTop: '-20px' }}>
        <Button
          text="Conocer más"
          location="page"
          href="/about"
        />
          </div>
 
        

        </div>

        
      </main>

      
    </div>
  );
}
