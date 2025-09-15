'use client';

import { useState } from 'react';
import styles from './galeria.module.css';
import Navbar from "../components/navbar";

const GaleriaClient = ({ imageMap }) => {

  const [selectedKey, setSelectedKey] = useState('2024');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 6;

  const images = imageMap[selectedKey] || [];
  const options = Object.keys(imageMap);
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const paginatedImages = images.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage);

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
            onClick={() => { setSelectedKey(opt); setCurrentPage(1); }}
            className={opt === selectedKey ? styles.active : ''}
          >
            {opt === 'vecinosBiotopoLaArdilla' ? 'Biotopo La Ardilla' : opt}
          </span>
        ))}
      </nav>


      <section className={styles.gallery}>
        {images.length > 0 ? (
          paginatedImages.map((img, index) => (
            <img
              key={index}
              src={`/assets/img/${selectedKey}/${img}`}
              alt={`Foto ${index + 1 + (currentPage - 1) * imagesPerPage}`}
              className={styles.image}
              onClick={() => setSelectedImage(`/assets/img/${selectedKey}/${img}`)}
            />
          ))
        ) : (
          <p className={styles.noImages}>No hay imágenes disponibles.</p>
        )}
      </section>

      {/* Paginación visual */}
      {images.length > imagesPerPage && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Anterior"
          >
            &#60;
          </button>
          {/* Mostrar máximo 5 botones de página */}
          {(() => {
            const pages = [];
            if (totalPages <= 5) {
              for (let i = 1; i <= totalPages; i++) {
                pages.push(
                  <button
                    key={i}
                    className={currentPage === i ? styles.activePage : styles.pageButton}
                    onClick={() => setCurrentPage(i)}
                  >
                    {i}
                  </button>
                );
              }
            } else {
              if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                  pages.push(
                    <button
                      key={i}
                      className={currentPage === i ? styles.activePage : styles.pageButton}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i}
                    </button>
                  );
                }
                pages.push(<span key="dots1">...</span>);
                pages.push(
                  <button
                    key={totalPages}
                    className={currentPage === totalPages ? styles.activePage : styles.pageButton}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                );
              } else if (currentPage > totalPages - 3) {
                pages.push(
                  <button
                    key={1}
                    className={currentPage === 1 ? styles.activePage : styles.pageButton}
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </button>
                );
                pages.push(<span key="dots2">...</span>);
                for (let i = totalPages - 3; i <= totalPages; i++) {
                  pages.push(
                    <button
                      key={i}
                      className={currentPage === i ? styles.activePage : styles.pageButton}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i}
                    </button>
                  );
                }
              } else {
                pages.push(
                  <button
                    key={1}
                    className={currentPage === 1 ? styles.activePage : styles.pageButton}
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </button>
                );
                pages.push(<span key="dots3">...</span>);
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                  pages.push(
                    <button
                      key={i}
                      className={currentPage === i ? styles.activePage : styles.pageButton}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i}
                    </button>
                  );
                }
                pages.push(<span key="dots4">...</span>);
                pages.push(
                  <button
                    key={totalPages}
                    className={currentPage === totalPages ? styles.activePage : styles.pageButton}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                );
              }
            }
            return pages;
          })()}
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Siguiente"
          >
            &#62;
          </button>
        </div>
      )}

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
