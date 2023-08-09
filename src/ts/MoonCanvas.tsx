import * as React from "react";
import { useState, PointerEvent, useRef } from "react";
import Canvas from "./drawing";

interface MoonCanvasProps {
    rows: number,
    columns: number,
}


export default function MoonCanvas(props: MoonCanvasProps) {
    const [canvas, setCanvas] = useState(new Canvas(props.rows, props.columns));
    const [lines, setLines] = useState(canvas.renderToEmojiLines());
    const [rect, setRect] = useState(new DOMRect());
    const canvasRef = useRef();

    if (rect.width === 0 || rect.height === 0) {
        if (canvasRef.current) {
            setRect((canvasRef.current as any).getBoundingClientRect());
        }
    }

    if (canvas.rows != props.rows || canvas.columns != props.columns) {
        setCanvas(new Canvas(props.rows, props.columns));
    }

    function onPointerMove(event: PointerEvent<HTMLParagraphElement>) {
        // const rect = event.target;
        // console.log(event.target);
        const row = (event.clientY - rect.top) / rect.height * canvas.rows;
        const column = (event.clientX - rect.left) / rect.width * canvas.columns;
        canvas.brush(row, column, 1, Math.max, (r, d) => (r * 0.5) / Math.sqrt(d));
        setLines(canvas.renderToEmojiLines());
    }

    return (
        <div style={{display: "inline-block"}} ref={canvasRef} onPointerMove={onPointerMove}>{lines.map((line, i) => <span key={i}>{line}<br/></span>)}</div>
    );
}
