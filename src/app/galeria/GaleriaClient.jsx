'use client';

import { useState } from 'react';
import styles from './galeria.module.css';
import Navbar from "../components/navbar";

const GaleriaClient = ({ imageMap }) => {
  const [selectedKey, setSelectedKey] = useState('2024');
  const [selectedImage, setSelectedImage] = useState(null);

  const images = imageMap[selectedKey] || [];
  const options = Object.keys(imageMap);

  return (
    <div className={styles.container}>
      <Navbar />

      <h1 className={styles.title}>
        Nuestra<br />Galería
      </h1>

      <nav className={styles.yearSelector}>
        {options.map((opt) => (
          <span
            key={opt}
            onClick={() => setSelectedKey(opt)}
            className={opt === selectedKey ? styles.active : ''}
          >
            {opt === 'vecinosBiotopoLaArdilla' ? 'Biotopo La Ardilla' : opt}
          </span>
        ))}
      </nav>

      <section className={styles.gallery}>
        {images.length > 0 ? (
          images.map((img, index) => (
            <img
              key={index}
              src={`/assets/img/${selectedKey}/${img}`}
              alt={`Foto ${index + 1}`}
              className={styles.image}
              onClick={() => setSelectedImage(`/assets/img/${selectedKey}/${img}`)}
            />
          ))
        ) : (
          <p className={styles.noImages}>No hay imágenes disponibles.</p>
        )}
      </section>

      {selectedImage && (
        <div className={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedImage(null)}>×</button>
            <img src={selectedImage} alt="Imagen ampliada" className={styles.modalImage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriaClient;
