// app/page.jsx  or  any component
import Navbar from "../components/navbar";
import styles from "../page.module.css";
import tmStyles from "./timeline.module.css"
import TimeLineVis from "./timeline";
import { getVisManager } from "@/lib/getVisManager";

export default function Vis() {
  const visMan = getVisManager();
  return (
    <div className={tmStyles.page}>
      <Navbar />
        <div className={tmStyles.pageStart}>


        </div>
        <h1 className={tmStyles.title}>
          Visualizacion<br />Satelital
        </h1>
      <main className={`${styles.main} ${tmStyles.visContainer}`}>
        
        <div className={tmStyles.pageStart}>
          <div className={tmStyles.startText}>
            <h2>
              Importancia del Monitoreo Satelital
            </h2>
            <p>
              La tecnología satelital nos permite observar los cambios en nuestra microcuenca en tiempo real, identificando patrones de deterioro o recuperación que serían invisibles a simple vista. Estas 
              imágenes son herramientas fundamentales para tomar decisiones informadas sobre la conservación 
              del Río Contreras y documentar el impacto de nuestras acciones de restauración.
            </p>

          </div>
          <TimeLineVis visMan={visMan}/>
        </div>

        <div className={tmStyles.textContent}>
         
          <div className={tmStyles.textContainer}>
            <h2>
            Índice NDVI (Vegetación)
            </h2>
            <p>
              El NDVI mide la salud y densidad de la vegetación mediante una escala de colores. Los tonos 
              verdes y amarillos indican vegetación saludable y abundante, mientras que los tonos rojos y 
              marrones señalan áreas con poca cobertura vegetal o suelo desnudo. Este índice nos ayuda a 
              identificar zonas de deforestación o éxito en proyectos de reforestación.
            </p>
          </div>

          <div className={tmStyles.textContainer}>
            <h2>
              Índice MNDWI (Cuerpos de Agua)
            </h2>
            <p >
              El MNDWI detecta la presencia y extensión de agua en la superficie. Los valores altos (azules 
              brillantes) representan cuerpos de agua permanentes, mientras que valores bajos indican zonas 
              secas o con humedad reducida. Este índice es crucial para monitorear el caudal del río, identificar 
              puntos de contaminación y evaluar la disponibilidad hídrica en nuestra microcuenca.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
