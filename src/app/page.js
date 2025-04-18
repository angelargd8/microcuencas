'use client';
import Image from "next/image";
import styles from "./page.module.css";
import Button from "./components/button";
import './globals.css';
import Navbar from "./components/navbar";
import LandingTextfield from "./components/textfield";


export default function Home() {

  const handleClick = () => {
    alert('click!');
  };

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
          

          {/* <p >
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,
          
          </p> */}

        
        <div className={styles.btn}>
          <Button
            text= {'Conocer más'}
            location = {'page'}
            onClick={handleClick}
          />

        {/* <div className={styles.ExampleTextfield}>
          <LandingTextfield
            title= {'TITULO 2 '}
            text= {'TEXTOOOOOOOOOOOOOOOOOOO'}
            location = {'normal'}
          />

        </div> */}


        </div>

        </div>

        
      </main>

      {/* <footer className={styles.footer}>
        
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer> */}
    </div>
  );
}
