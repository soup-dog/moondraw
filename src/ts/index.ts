import { Moon } from "lunarphase-js";


// make palette
enum Direction {
    Left,
    Right,
}


class Palette {
    left: string[];
    right: string[];

    constructor(left: string[], right: string[]) {
        this.left = left;
        this.right = right;
    }

    getEmoji(direction: Direction, value: number) {
        switch (direction) {
            case Direction.Left:
                return this.left[Math.round(value * (this.left.length - 1))];
            case Direction.Right:
                return this.right[Math.round(value * (this.right.length - 1))];
        }
    }
}


const palette = new Palette(["🌑", "🌘", "🌗", "🌖", "🌕"], ["🌑", "🌒", "🌓", "🌔", "🌕"]);

// add a cool title
function randomChoice(arr: {length: number, [key: number]: any}) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const title = Moon.lunarPhaseEmoji() + randomChoice(["🖊️", "✒️", "🖋️", "✏️", "🎨", "🖌️"]);

document.title = title;

// make canvas
const rows = 16;
const columns = 16;
const size = rows * columns;

type Exel = [Direction, number];
type Canvas = Exel[];

const canvas: Canvas = Array.from({length: size}, () => [Direction.Left, 0]);

function renderToEmojis(canvas: Canvas, palette: Palette) {
    let emojis = "";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const i = r * columns + c;

            const [direction, fullness] = canvas[i];

            emojis += palette.getEmoji(direction, fullness);
        }
        emojis += "<br>";
    }

    return emojis;
}

const pCanvas = document.createElement("p");
document.body.appendChild(pCanvas);

function distSquared(x1: number, y1: number, x2: number, y2: number) {
    const a = x1 - x2;
    const b = y1 - y2;
    return a * a + b * b;
}

function brush(canvas: Canvas, row: number, column: number, radius: number = 1, blend: (a: number, b: number) => number = Math.max, fullnessFn: (r: number, dSqrd: number) => number = (r, d) => r / Math.sqrt(d)) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const i = r * columns + c;
            const d = distSquared(r, c, row, column);
            if (d < radius * radius) {
                // const v = radius / distSquared(r, c, row, column);
                const v = fullnessFn(radius, d);
                const clamped = blend(canvas[i][1], Math.max(0, Math.min(v, 1)));
                canvas[i] = [c > column ? Direction.Left : Direction.Right, clamped];
            }
        }
    }
}

// brush(canvas, 5, 5, 4);

pCanvas.innerHTML = renderToEmojis(canvas, palette);
const rect = pCanvas.getBoundingClientRect();
console.log(rect);

window.addEventListener("pointermove", function(event: PointerEvent) {
    const row = (event.clientY - rect.top) / rect.height * rows;
    const column = (event.clientX - rect.left) / rect.width * columns;
    brush(canvas, row, column, 1, Math.max, (r, d) => (r * 0.5) / Math.sqrt(d));
    pCanvas.innerHTML = renderToEmojis(canvas, palette);
});

