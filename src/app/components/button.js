'use client';
import styles from './button.module.css';
const Button = ({ text, className = '', onClick }) => {
  return (
    <button
      className={`${styles.btn} ${className}`}
      onClick={onClick}
    >
      {" "}
      {text}{" "}
    </button>
  );
};

export default Button;
