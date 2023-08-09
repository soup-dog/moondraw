import * as React from "react";
import { useState, PointerEvent, useRef, useEffect } from "react";
import Canvas from "./drawing";


export type BrushType = "draw" | "erase";

interface Brush {
    blend: (a: number, b: number) => number,
    fullnessFn: (r: number, dSqrd: number) => number,
    flip: boolean,
}

interface MoonCanvasProps {
    rows: number,
    columns: number,
    getBrush: () => BrushType,
}


export default function MoonCanvas(props: MoonCanvasProps) {
    const [canvas, setCanvas] = useState(new Canvas(props.rows, props.columns));
    const [lines, setLines] = useState(canvas.renderToEmojiLines());
    const [rect, setRect] = useState(new DOMRect());
    const canvasRef = useRef();
    const pointerDown = useRef(false);
    useEffect(() => {
        const onPointerDown = () => pointerDown.current = true;
        const onPointerUp = () => pointerDown.current = false;
        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointerup", onPointerUp);
        return () => {
            window.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointerup", onPointerUp);
        };
    });
    
    const brushes = {
        draw: {
            blend: Math.max,
            fullnessFn: (r: number, d: number) => (r * 0.5) / Math.sqrt(d),
            flip: false,
        },
        erase: {
            blend: Math.min,
            fullnessFn: (r: number, d: number) => 1 - (r * 0.5) / Math.sqrt(d),
            flip: true,
        },
    }

    if (rect.width === 0 || rect.height === 0) {
        if (canvasRef.current) {
            setRect((canvasRef.current as any).getBoundingClientRect());
        }
    }

    if (canvas.rows != props.rows || canvas.columns != props.columns) {
        setCanvas(new Canvas(props.rows, props.columns));
    }

    function onPointerMove(event: PointerEvent<HTMLParagraphElement>) {
        if (!pointerDown.current) return;
        const row = (event.clientY - rect.top) / rect.height * canvas.rows;
        const column = (event.clientX - rect.left) / rect.width * canvas.columns;
        const {blend, fullnessFn, flip} = brushes[props.getBrush()];
        canvas.brush(row, column, 1, blend, fullnessFn, flip);
        setLines(canvas.renderToEmojiLines());
    }

    return (
        <div
            style={{width: "fit-content"}}
            ref={canvasRef}
            onPointerMove={onPointerMove}
            onPointerDown={(event) => {
                event.preventDefault(); // prevent text from being highlighted
                // pointerDown.current = true
            }}
            // onPointerUp={() => pointerDown.current = false}
        >
            {lines.map((line, i) => <span key={i}>{line}<br/></span>)}
        </div>
    );
}
