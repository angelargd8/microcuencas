"use client";
import timelineStyles from "./timeline.module.css";
import React, { useState, useRef, useEffect, useCallback } from "react";
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
	const [currentIdx, setCurrentIdx] = useState(0);
  const noticiasFiltradas = noticias.filter(n => n.year === year);

	// Datos dinámicos de carreras/facultades (añade/edita según necesites)
	const carreras = [
		{
			codigoFac: 'ING',
			facultadClase: 'ingenieria',
			facultadNombre: 'FACULTAD DE INGENIERÍA',
			programa: 'Ingeniería Civil',
			bullets: [
				'Propuestas de nuevas infraestructuras de saneamiento.',
				'Plan de control de residuos sólidos.',
				'Identificación de zonas críticas.'
			],
			logo: 'FacultadIngenieria.webp'
		},
		{
			codigoFac: 'CCSS',
			facultadClase: 'ccss',
			facultadNombre: 'FACULTAD DE CIENCIAS SOCIALES',
			programa: 'Antropología',
			bullets: [
				'Programa de sensibilización comunitaria.',
				'Talleres educativos sobre beneficios de ecosistemas saludables.',
				'Metodologías de participación social inclusiva.'
			],
			logo: 'facultadCienciasSociales.webp'
		},
		{
			codigoFac: 'CCHH',
			facultadClase: 'cchh',
			facultadNombre: 'FACULTAD DE CIENCIAS Y HUMANIDADES',
			programa: 'Biología / Bioquímica / Química',
			bullets: [
				'Monitoreo continuo de calidad de agua.',
				'Identificación de zonas ecológicas críticas.',
				'Programa de restauración ecológica.'
			],
			logo: 'facultadCienciasHumanidades.webp'
		}
	];
	const computeStep = useCallback(() => {
		const el = carruselRef.current;
		if (!el) return { step: 300, padLeft: 0, cardW: 280, gap: 16 };
		const styles = window.getComputedStyle(el);
		const gap = parseFloat(styles.gap || styles.columnGap || "16") || 16;
		const padLeft = parseFloat(styles.paddingLeft || "0") || 0;
		const first = el.querySelector('[data-card="true"]');
		const cardW = first ? first.getBoundingClientRect().width : 280;
		return { step: cardW + gap, padLeft, cardW, gap };
	}, []);

	const scrollToIndex = useCallback((index) => {
		const el = carruselRef.current;
		if (!el) return;
		const total = Math.max(0, (index ?? 0));
		const { step, padLeft, cardW } = computeStep();
		const targetLeft = Math.max(0, (padLeft + step * total + (cardW / 2) - (el.clientWidth / 2)));
		const maxLeft = el.scrollWidth - el.clientWidth;
		el.scrollTo({ left: Math.min(targetLeft, maxLeft), behavior: 'smooth' });
	}, [computeStep]);

	useEffect(() => {
		const el = carruselRef.current;
		if (!el) return;
		const onScroll = () => {
			const { step, padLeft } = computeStep();
			const rel = Math.max(0, el.scrollLeft - padLeft);
			const idx = Math.round(rel / step);
			setCurrentIdx(Math.max(0, Math.min(idx, carreras.length - 1)));
		};
		const onResize = () => {
			onScroll();
			scrollToIndex(currentIdx);
		};
		el.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize);
		// Initialize position
		onScroll();
		return () => {
			el.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
		};
	}, [computeStep, scrollToIndex, currentIdx, carreras.length]);

	return (
	<div className={timelineStyles["timeline-page"]}>
	  <Navbar />
	  <main className={timelineStyles["timeline-main"]}>
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
		<section className={timelineStyles["timeline-procedimiento"]}>
		  <h2 className={timelineStyles["timeline-section-title"]}>Procedimiento Desarrollado</h2>
		  <div className={timelineStyles["timeline-objetivo"]}>
			<span className={timelineStyles["timeline-objetivo-titulo"]}>Objetivo General</span>
			<span className={timelineStyles["timeline-objetivo-desc"]}>
			  Desarrollar e implementar un plan integral de recuperación y gestión sostenible de la microcuenca del Río Contreras, a través del mejoramiento de la calidad del agua, la reducción de la contaminación, la restauración ecológica y la participación comunitaria, utilizando estrategias basadas en ciencia, infraestructura, comunicación estratégica y tecnología.
			</span>
		  </div>
					<div className={timelineStyles["timeline-carrusel-wrapper"]}>
						<button className={`${timelineStyles["timeline-carrusel-arrow"]} ${timelineStyles["timeline-carrusel-arrow-left"]}`}
							aria-label="Anterior"
							disabled={currentIdx <= 0}
							onClick={() => { const prev = Math.max(0, currentIdx - 1); scrollToIndex(prev); }}>
			  &#60;
			</button>
			<div className={timelineStyles["timeline-carrusel"]} ref={carruselRef}>
			  {carreras.map((c, idx) => (
				<div key={idx} data-card="true" className={timelineStyles["timeline-carrusel-card"]}>
				  {c.logo && (
					<img src={c.logo} alt={c.programa} className={timelineStyles["timeline-carrusel-logo"]} />
				  )}
				  {!c.logo && (
					<div className={timelineStyles["timeline-carrusel-head-text"]}>
					  <span className={`${timelineStyles["timeline-carrusel-fac"]} ${timelineStyles[c.facultadClase]}`}>{c.codigoFac}</span>
					  <span className={timelineStyles["timeline-carrusel-fac-label"]}>{c.facultadNombre}</span>
					</div>
				  )}
				  <div className={timelineStyles["timeline-carrusel-titulo"]}>{c.programa}</div>
				  <ul className={timelineStyles["timeline-carrusel-list"]}>
					{c.bullets.map((b,i) => <li key={i}>{b}</li>)}
				  </ul>
				</div>
			  ))}
			</div>
			<div className={timelineStyles["timeline-dots"]}>
			  {carreras.map((_, i) => (
				<button
				  key={i}
				  aria-label={`Ir a tarjeta ${i+1}`}
				  className={i === currentIdx ? `${timelineStyles["timeline-dot"]} ${timelineStyles["timeline-dot-active"]}` : timelineStyles["timeline-dot"]}
				  onClick={() => scrollToIndex(i)}
				/>
			  ))}
			</div>
						<button className={`${timelineStyles["timeline-carrusel-arrow"]} ${timelineStyles["timeline-carrusel-arrow-right"]}`}
							aria-label="Siguiente"
							disabled={currentIdx >= carreras.length - 1}
							onClick={() => { const next = Math.min(currentIdx + 1, carreras.length - 1); scrollToIndex(next); }}>
			  &#62;
			</button>
		  </div>
		</section>
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
	  </main>
	</div>
  );
}
