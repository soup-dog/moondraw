import * as React from "react";
import { useState, PointerEvent, useRef } from "react";
import Canvas from "./drawing";


export type BrushType = "draw" | "erase";

interface Brush {
    blend: (a: number, b: number) => number,
    fullnessFn: (r: number, dSqrd: number) => number,
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
    const mouseDown = useRef(false);
    
    const brushes = {
        draw: {
            blend: Math.max,
            fullnessFn: (r: number, d: number) => (r * 0.5) / Math.sqrt(d),
        },
        erase: {
            blend: Math.min,
            fullnessFn: (r: number, d: number) => 1 - (r * 0.5) / Math.sqrt(d),
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
        if (!mouseDown.current) return;
        const row = (event.clientY - rect.top) / rect.height * canvas.rows;
        const column = (event.clientX - rect.left) / rect.width * canvas.columns;
        const {blend, fullnessFn} = brushes[props.getBrush()];
        canvas.brush(row, column, 1, blend, fullnessFn);
        setLines(canvas.renderToEmojiLines());
    }

    return (
        <div
            style={{display: "inline-block"}}
            ref={canvasRef}
            onPointerMove={onPointerMove}
            onPointerDown={(event) => {
                event.preventDefault(); // prevent text from being highlighted
                mouseDown.current = true
            }}
            onPointerUp={() => mouseDown.current = false}
        >
            {lines.map((line, i) => <span key={i}>{line}<br/></span>)}
        </div>
    );
}
