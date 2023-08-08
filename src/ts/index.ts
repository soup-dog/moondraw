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
                return this.left[value];
            case Direction.Right:
                return this.right[value];
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

const canvas: Canvas = Array.from({length: size}, () => [Direction.Left, 2]);

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

function brush(canvas: Canvas, row: number, column: number, fullnessFn: (r: number, c: number) => boolean) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const i = r * columns + c;
            canvas[i] = [c > column ? Direction.Left : Direction.Right, canvas[i][1]];
        }
    }
}

brush(canvas, 0, 5, (r, c) => null);

pCanvas.innerHTML = renderToEmojis(canvas, palette);
