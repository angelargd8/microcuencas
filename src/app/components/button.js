'use client';
import styles from './button.module.css';
const Button = ({ text, className = '', location='', onClick }) => {
  return (
    <>
      {location === 'navbar' ? (
        <button
          className={`${styles.navbar} ${className}`}
          onClick={onClick}
        >
          {text}
        </button>
      ) : (
        <button
          className={`${styles.btn} ${className}`}
          onClick={onClick}
        >
          {text}
        </button>
      )}
    </>
  );
};

export default Button;
