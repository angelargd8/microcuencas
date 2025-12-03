'use client';

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
const TimeLineVis = ({visMan})=>{

    const [index, setIndex] = useState(0)
    const [variation, setVariation] = useState(0)
    return (
    <div>
        <label>
        <input 
            type="radio" 
            name="mode" 
            value={variation}
        />
        Color Real
        </label>
        <label>
        <input 
            type="radio" 
            name="mode" 
            value={variation}
        />
        NDVI
        </label>
        <label>
        <input 
            type="radio" 
            name="mode" 
            value={variation}
            />
        MNDWI
        </label>

        <Image
          src={`/assets/vis/${visMan.rgb[index]}`}
          alt="River"
          width={400}
          height={400}
        />
        <div style={{ marginTop: "10vh" }}>
            <input
                type="range"
                min={0}
                max={20}
                value={index}
                onChange={(e) =>{
                    setIndex(Number(e.target.value))
                }}
            />
        </div>
    </div>
    )
}

export default TimeLineVis;