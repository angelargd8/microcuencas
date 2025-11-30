"use client";
import styles from "../page.module.css";
import timelineStyles from "./timeline.module.css";
import React, { useState, useRef } from "react";
import Navbar from "../components/navbar";

export const noticias = [
	{
		year: 2025,
		titulo: "Proyecto multidisciplinario de estudiantes de UVG busca ideas innovadoras para rescatar el río Contreras",
		autor: "Pedro Barrera",
		fecha: "02/04/2025",
		resumen:
			<>
			En el marco del Día Internacional de Acción por los Ríos, estudiantes de diversas carreras de la Universidad del Valle de Guatemala (UVG) realizaron una visita de caracterización a la microcuenca pedagógica del río Contreras. Esta iniciativa, impulsada por el Departamento de Ingeniería Civil, promueve la gestión integral de recursos hídricos y la colaboración interdisciplinaria para evaluar el estado actual del río, identificar problemáticas y proponer soluciones innovadoras.<br />
			Participaron estudiantes de Ingeniería Civil, Industrial, Biotecnología, Química, Ciencia de la Computación, Antropología, Química, Biología, Bioquímica y Microbiología, quienes realizaron análisis de calidad del agua, mapeo con drones y equipos de geolocalización, y talleres de sensibilización. El trabajo conjunto permitió delimitar las características principales del río y comprender sus retos ambientales.<br />
			La actividad contó con el apoyo de Empagua, Funcagua, la Alcaldía Auxiliar de zona 15 y la Municipalidad de Guatemala, fortaleciendo la investigación y ampliando el alcance de las acciones de recuperación. El objetivo es documentar el estado actual del río y proponer soluciones sostenibles a largo plazo, demostrando que la colaboración entre disciplinas y actores es clave para rescatar los recursos naturales.
			</>,
			imagenes: [
				"Rio-Contreras2025.jpg"
			],
		link: "https://noticias.uvg.edu.gt/proyecto-multidisciplinario-de-estudiantes-de-uvg-busca-ideas-innovadoras-para-rescatar-el-rio-contreras/"
	},
		{
			year: 2024,
			titulo: "Microcuenca Pedagógica del rio Contreras: Ejemplo de un proyecto multidisciplinario",
			autor: "Noticias UVG",
			fecha: "02/07/2024",
			resumen:
				<>
				Estudiantes de la Universidad del Valle de Guatemala (UVG) desarrollaron un proyecto multidisciplinario para rescatar el río Contreras, integrando conocimientos de ingeniería, ciencias sociales y ambientales. La iniciativa fomenta la colaboración entre distintas carreras y actores comunitarios, buscando soluciones innovadoras para mejorar la calidad del agua, restaurar el ecosistema y sensibilizar a la población sobre la importancia de conservar los recursos hídricos.<br />
				El proyecto incluye actividades de monitoreo, talleres educativos y propuestas de intervención, promoviendo la participación activa de estudiantes, docentes y vecinos. Esta experiencia se convierte en un modelo de trabajo colaborativo y sostenible, con impacto positivo en la comunidad y potencial de replicarse en otras microcuencas del país.
				</>,
			imagenes: [
				"Microcuenca-Rio-Contreras2024.jpg"
			],
			link: "https://noticias.uvg.edu.gt/microcuenca-pedagogica-del-rio-contreras-ejemplo-de-un-proyecto-multidisciplinario/"
		}
];

export default function Timeline() {
	const [year, setYear] = useState(2024);
	const carruselRef = useRef(null);
  const noticiasFiltradas = noticias.filter(n => n.year === year);
  return (
	<div className={styles.page}>
	  <Navbar />
	  <main className={styles.main}>
		<h1 className={timelineStyles["timeline-title"]}>El Paso del Tiempo</h1>
		<div className={timelineStyles["timeline-tabs"]}>
		  {[2024, 2025].map((a) => (
			<button
			  key={a}
			  onClick={() => setYear(a)}
			  className={
				year === a
				  ? timelineStyles["timeline-tab-active"]
				  : timelineStyles["timeline-tab"]
			  }
			>
			  {a}
			</button>
		  ))}
		</div>
		<section className={timelineStyles["timeline-section"]}>
		  <h2 className={timelineStyles["timeline-section-title"]}>Noticias Publicadas</h2>
		  <div className={timelineStyles["noticias-container"]}>
			{noticiasFiltradas.length === 0 && (
			  <div className={timelineStyles["noticias-empty"]}>No hay noticias para este año.</div>
			)}
			{noticiasFiltradas.map((n, i) => (
			  <div key={i} className={timelineStyles["noticia-tarjeta"]}>
				{n.imagenes && n.imagenes.length > 0 && (
				  <div className={timelineStyles["noticia-img-box"]}>
					<img
					  src={n.imagenes[0]}
					  alt={n.titulo}
					  className={timelineStyles["noticia-img"]}
					/>
				  </div>
				)}
				<div className={timelineStyles["noticia-content"]}>
				  <h3 className={timelineStyles["noticia-titulo"]}>{n.titulo}</h3>
				  <div className={timelineStyles["noticia-meta"]}>
					<svg width="18" height="18" fill="#257a3e" className={timelineStyles["noticia-meta-icon"]} viewBox="0 0 20 20"><circle cx="9" cy="9" r="8" stroke="#257a3e" strokeWidth="2" fill="none"/><circle cx="9" cy="9" r="3" fill="#257a3e"/></svg>
					{n.autor && <span className={timelineStyles["noticia-meta-autor"]}>{n.autor}</span>}
					<span className={timelineStyles["noticia-meta-fecha"]}>{n.fecha}</span>
				  </div>
				  <div className={timelineStyles["noticia-resumen"]}>{n.resumen}</div>
				  <a
					href={n.link}
					target="_blank"
					rel="noopener noreferrer"
					className={timelineStyles["noticia-btn"]}
				  >
					Leer Artículo
				  </a>
				</div>
			  </div>
			))}
		  </div>
		</section>
		<section className={timelineStyles["timeline-procedimiento"]}>
		  <h2 className={timelineStyles["timeline-section-title"]}>Procedimiento Desarrollado</h2>
		  <div className={timelineStyles["timeline-objetivo"]}>
			<span className={timelineStyles["timeline-objetivo-titulo"]}>Objetivo General</span>
			<span className={timelineStyles["timeline-objetivo-desc"]}>
			  Desarrollar e implementar un plan integral de recuperación y gestión sostenible de la microcuenca del Río Contreras, a través del mejoramiento de la calidad del agua, la reducción de la contaminación, la restauración ecológica y la participación comunitaria, utilizando estrategias basadas en ciencia, infraestructura, comunicación estratégica y tecnología.
			</span>
		  </div>
		  <div className={timelineStyles["timeline-carrusel"]} ref={carruselRef}>
			<button className={timelineStyles["timeline-carrusel-arrow"]} aria-label="Anterior" onClick={() => {
			  const el = carruselRef.current; if (!el) return; el.scrollBy({ left: -320, behavior: "smooth" });
			}}>&#60;</button>
			<div className={timelineStyles["timeline-carrusel-card"]}>
			  <span className={`${timelineStyles["timeline-carrusel-fac"]} ${timelineStyles["ingenieria"]}`}>ING</span>
			  <span className={timelineStyles["timeline-carrusel-fac-label"]}>FACULTAD DE INGENIERÍA</span>
			  <div className={timelineStyles["timeline-carrusel-titulo"]}>Ingeniería Civil</div>
			  <ul className={timelineStyles["timeline-carrusel-list"]}>
				<li>Propuestas de nuevas infraestructuras de saneamiento.</li>
				<li>Plan de control de residuos sólidos.</li>
				<li>Identificación de zonas críticas.</li>
			  </ul>
			</div>
			<div className={timelineStyles["timeline-carrusel-card"]}>
			  <span className={`${timelineStyles["timeline-carrusel-fac"]} ${timelineStyles["ccss"]}`}>CCSS</span>
			  <span className={timelineStyles["timeline-carrusel-fac-label"]}>FACULTAD DE CIENCIAS SOCIALES</span>
			  <div className={timelineStyles["timeline-carrusel-titulo"]}>Antropología</div>
			  <ul className={timelineStyles["timeline-carrusel-list"]}>
				<li>Programa de sensibilización comunitaria.</li>
				<li>Talleres educativos sobre los beneficios de ecosistemas saludables.</li>
				<li>Metodologías de participación social inclusiva.</li>
			  </ul>
			</div>
			<div className={timelineStyles["timeline-carrusel-card"]}>
			  <span className={`${timelineStyles["timeline-carrusel-fac"]} ${timelineStyles["cchh"]}`}>CCHH</span>
			  <span className={timelineStyles["timeline-carrusel-fac-label"]}>FACULTAD DE CIENCIAS Y HUMANIDADES</span>
			  <div className={timelineStyles["timeline-carrusel-titulo"]}>Biología/Bioquímica/Química</div>
			  <ul className={timelineStyles["timeline-carrusel-list"]}>
				<li>Monitoreo de calidad de agua mediante un sistema continuo.</li>
				<li>Identificación de zonas ecológicas críticas.</li>
				<li>Diseño e implementación de un programa de restauración ecológica.</li>
			  </ul>
			</div>
			<button className={timelineStyles["timeline-carrusel-arrow"]} aria-label="Siguiente" onClick={() => {
			  const el = carruselRef.current; if (!el) return; el.scrollBy({ left: 320, behavior: "smooth" });
			}}>&#62;</button>
		  </div>
		</section>
	  </main>
	</div>
  );
}
