'use client';

import Link from 'next/link';
import styles from './button.module.css';

const Button = ({ text, className = '', location = '', onClick, href = '' }) => {
  const buttonClass = location === 'navbar' ? styles.btn : styles.navbar;
  const combinedClass = `${buttonClass} ${className}`.trim();

  const buttonElement = (
    <button className={combinedClass} onClick={onClick}>
      {text}
    </button>
  );

  return href ? <Link href={href}>{buttonElement}</Link> : buttonElement;
};

export default Button;
