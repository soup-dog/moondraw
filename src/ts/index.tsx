import { Moon } from "lunarphase-js";

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from "./App";
import '@fontsource/inter';
import Canvas from "./drawing";


// add a cool title
function randomChoice(arr: {length: number, [key: number]: any}) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const title = Moon.lunarPhaseEmoji() + randomChoice(["🖊️", "✒️", "🖋️", "✏️", "🎨", "🖌️"]);

document.title = "MOON" + title + "DRAW";


const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);

root.render(<App title={title}/>);


// const rows = 16;
// const columns = 16;

// const canvas = new Canvas(16, 16);

// const pCanvas = document.createElement("p");
// document.body.appendChild(pCanvas);

// pCanvas.innerHTML = canvas.renderToEmojis();
// const rect = pCanvas.getBoundingClientRect();
// console.log(rect);

// window.addEventListener("pointermove", function(event: PointerEvent) {
//     const row = (event.clientY - rect.top) / rect.height * rows;
//     const column = (event.clientX - rect.left) / rect.width * columns;
//     canvas.brush(row, column, 1, Math.max, (r, d) => (r * 0.5) / Math.sqrt(d));
//     pCanvas.innerHTML = canvas.renderToEmojis();
// });

