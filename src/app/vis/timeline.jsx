'use client';

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import tmStyles from "./timeline.module.css";


const TimeLineVis = ({visMan})=>{
    const imagesAmount = visMan.rgb.length
    const min_date = `${visMan.rgb[0].slice(0,4)}`
    const max_date =`${visMan.rgb[imagesAmount-1].slice(0,4)}`
    const [play, setPlay] = useState(false)
    const playRef = useRef(false);
    const [index, setIndex] = useState(0)
    const [variation, setVariation] = useState(0)

    const [showOverlay, setShowOverlay] = useState(false)


    useEffect(() => {
        playRef.current = play;
    }, [play]);


    async function startPlay() {
        setPlay(true);
        for (let i = index; i <= imagesAmount-1; i++) {
            setIndex(i);
            await new Promise(res => setTimeout(res, 100));
            if (!playRef.current){
                return
            }
        }
    }

    return (
    <div className={tmStyles.tmContainer}>
    
        {/* Date */}
        <div className={tmStyles.headContainer}>
            <h2>
                Rio Contreras
            </h2>
            <div className={tmStyles.headSub}>
                <p>
                    {`${visMan.rgb[index].slice(0,4)}-${visMan.rgb[index].slice(4,6)}-${visMan.rgb[index].slice(6,8)}`}
                </p>
                <button onClick={()=>{setShowOverlay(!showOverlay);}}>
                    <Image
                        className="iconImage"
                        src="/icons/river.svg"
                        alt="Refresh"
                        width={24}
                        height={18}
                    />
                </button>
            </div>
        </div>
        {/* Image loader */}
        <div className={tmStyles.imageContainer}>
            <Image
                className={tmStyles.imageLoader}
                src={`/assets/vis/${
                    variation == 1? visMan.ndvi[index] : (variation==2 ? visMan.mndwi[index] : visMan.rgb[index])
                }`}
                fill
                alt="River"
            />
            {showOverlay && 
                <Image
                    className={tmStyles.imageOverlay}
                    fill
                    src="/assets/vis/river_outline.png"
                    alt="River"
                />
            }

        </div>

        {/* Mode selector (RGB, NDVI, MNDWI) */}
        <div className={tmStyles.radioContainer}>
            <input 
                id="rgb"
                type="radio" 
                name="mode" 
                value={variation}
                checked={variation===0}
                onChange={()=>{
                    setVariation(0)
                }}
                className={tmStyles.radioOption}
            />  
            <label htmlFor="rgb" className={tmStyles.radioLabel}>Color Real</label>
            
            <input 
                id="ndvi"
                type="radio" 
                name="mode" 
                value={variation}
                checked={variation===1}
                onChange={()=>{
                    setVariation(1)
                }}
                className={tmStyles.radioOption}
            />
            <label htmlFor="ndvi" className={tmStyles.radioLabel}>NDVI</label>
            
            <input 
                id="mndwi"
                type="radio" 
                name="mode" 
                value={variation}
                checked={variation===2}
                onChange={()=>{
                    setVariation(2)
                }}
                className={tmStyles.radioOption}
            />
            <label htmlFor="mndwi" className={tmStyles.radioLabel}>MNDWI</label>
        </div>

        {/* Options */}
        <div className={tmStyles.optionContainer}>
            {/* Date selector */}
            <div className={tmStyles.dateContainer}>
                <p>{`${min_date}`}</p>
                <input
                    type="range"
                    min={0}
                    max={imagesAmount-1}
                    value={index}
                    onChange={(e) =>{
                        setIndex(Number(e.target.value))
                    }}
                />
                <p>{`${max_date}`}</p>
            </div>

            {/* Timeline options */}
            <div className={tmStyles.buttonContainer}>
                <button onClick={startPlay} className={tmStyles.tmButton}>
                    <Image
                        src="/icons/play.svg"
                        alt="Refresh"
                        width={24}
                        height={24}
                    />
                </button>

                <button onClick={()=>{ setPlay(false) }} className={tmStyles.tmButton}>
                    <Image
                        src="/icons/stop.svg"
                        alt="Refresh"
                        width={24}
                        height={16}
                    />
                </button>

                <button onClick={()=>{ setPlay(false); setIndex(0);}} className={tmStyles.tmButton}>
                    <Image
                        className="iconImage"
                        src="/icons/refresh.svg"
                        alt="Refresh"
                        width={24}
                        height={18}
                    />
                </button>
            </div>
        

        </div>
    </div>
    )
}

export default TimeLineVis;