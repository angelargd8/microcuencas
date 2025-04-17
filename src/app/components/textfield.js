'use client';
import styles from './textfield.module.css';
const Textfield = ({title, text, location=''}) => {
    return (
      <>

      {location === 'landingPage' ? (

        <div className={styles.landingPage}>
          <h1>
            {title}
          </h1>
          <p>
            {text}
          </p>
        </div>

      ) : (
        // si no es landingPage
        <div className={styles.textfield}>
          <h1>
            {title}
          </h1>

          <p>
            {text}
          </p>
        </div>

      )}
    </>
    );
  };
  
  export default Textfield;