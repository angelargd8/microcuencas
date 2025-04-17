'use client';
import Image from "next/image";
import styles from "./page.module.css";
import ExampleButton from "./components/button";
import './globals.css';




export default function Home() {

  const handleClick = () => {
    alert('click!');
  };

  return (
    <div className={styles.page}>
      
      <main className={styles.main}>
        
        <ol>
          <li>
            Get started by editing <code>src/app/page.js</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>

        <div className={styles.cta}>
          <ExampleButton
            text= {'Haz clic aquí'}
            onClick={handleClick}
          />


        </div>



        </div>
      </main>

      <footer className={styles.footer}>
        
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
      </footer>
    </div>
  );
}
