import { useEffect, useRef, useState } from "react";
import canvasImages from "./canvasImages";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";

function Canvas({ details }) {
    const { startIndex, numImages, duration,size,top,left,zIndex } = details;//destructuring the details object
    const[index, setIndex] = useState({value: startIndex});
    const canvasRef = useRef(null);

    useGSAP(() => {
        gsap.to(index,{
            value: startIndex+numImages-1,//this can cause the value to be 0.1,0.2 but we want the value to be whole number so we use round function
            duration:duration,
            repeat: -1,
            ease: "linear",
            onUpdate: () => {
                setIndex({ value: Math.round(index.value) });
            },   
        });

        gsap.from(canvasRef.current, {
            opacity:0,
            duration:1,
            ease:"power2.inOut",
        });
    });    

    useEffect(() => {
        const scale = window.devicePixelRatio;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');//ctx is the drawing tool
        const img = new Image();
        img.src = canvasImages[index.value];
        img.onload = () => {
            canvas.width = canvas.offsetWidth*scale;
            canvas.height = canvas.offsetHeight*scale;
            canvas.style.width = canvas.offsetWidth + "px";
            canvas.style.height = canvas.offsetHeight + "px";
            ctx.scale(scale,scale);
            ctx.drawImage(img, 0, 0,canvas.offsetWidth,canvas.offsetHeight);
        };    
    },[index]); //[index] is the dependency array, it means that the useEffect will run when the index state changes
    return(
        <canvas
            data-scroll
            data-scroll-speed={(Math.random().toFixed(1))}
            ref={canvasRef}
            className="absolute"
            style={{
                width: `${size*1.4}px`,
                height: `${size*1.4}px`,
                top: `${top}%`,
                left: `${left}%`,
                zIndex: `${zIndex}`
            }}
            id="canvas"
        ></canvas>
    ); 
}    

export default Canvas;