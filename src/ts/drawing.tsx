// make palette
export enum Direction {
    Left,
    Right,
}


export class Palette {
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


// const palette = new Palette(["🌑", "🌘", "🌗", "🌖", "🌕"], ["🌑", "🌒", "🌓", "🌔", "🌕"]);

// make canvas
// const rows = 16;
// const columns = 16;
// const size = rows * columns;

export type Exel = [Direction, number];
export type Image = Exel[];

// const image: Image = Array.from({length: size}, () => [Direction.Left, 0]);

// function renderToEmojis(image: Image, palette: Palette) {
//     let emojis = "";

//     for (let r = 0; r < rows; r++) {
//         for (let c = 0; c < columns; c++) {
//             const i = r * columns + c;

//             const [direction, fullness] = image[i];

//             emojis += palette.getEmoji(direction, fullness);
//         }
//         emojis += "<br>";
//     }

//     return emojis;
// }

function distSquared(x1: number, y1: number, x2: number, y2: number) {
    const a = x1 - x2;
    const b = y1 - y2;
    return a * a + b * b;
}

// function brush(image: Image, row: number, column: number, radius: number = 1, blend: (a: number, b: number) => number = Math.max, fullnessFn: (r: number, dSqrd: number) => number = (r, d) => r / Math.sqrt(d)) {
//     for (let r = 0; r < rows; r++) {
//         for (let c = 0; c < columns; c++) {
//             const i = r * columns + c;
//             const d = distSquared(r, c, row, column);
//             if (d < radius * radius) {
//                 // const v = radius / distSquared(r, c, row, column);
//                 const v = fullnessFn(radius, d);
//                 const clamped = blend(image[i][1], Math.max(0, Math.min(v, 1)));
//                 image[i] = [c > column ? Direction.Left : Direction.Right, clamped];
//             }
//         }
//     }
// }


export default class Canvas {
    readonly rows: number;
    readonly columns: number;
    image: Image;
    palette: Palette;

    constructor(rows: number, columns: number) {
        const size = rows * columns;
        this.rows = rows;
        this.columns = columns;
        this.image = Array.from({length: size}, () => [Direction.Left, 0]);
        this.palette = new Palette(["🌑", "🌘", "🌗", "🌖", "🌕"], ["🌑", "🌒", "🌓", "🌔", "🌕"]);
    }

    brush(row: number, column: number, radius: number = 1, blend: (a: number, b: number) => number = Math.max, fullnessFn: (r: number, dSqrd: number) => number = (r, d) => r / Math.sqrt(d), flip: boolean = false) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                const i = r * this.columns + c;
                const d = distSquared(r, c, row, column);
                if (d < radius * radius) {
                    // const v = radius / distSquared(r, c, row, column);
                    const v = fullnessFn(radius, d);
                    const clamped = blend(this.image[i][1], Math.max(0, Math.min(v, 1)));
                    this.image[i] = [c > column !== flip ? Direction.Left : Direction.Right, clamped];
                }
            }
        }
    }

    renderToEmojis(palette: Palette = null, linebreak: string = "\n"): string {
        palette = palette ?? this.palette;

        let emojis = "";
    
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                const i = r * this.columns + c;
    
                const [direction, fullness] = this.image[i];
    
                emojis += palette.getEmoji(direction, fullness);
            }
            emojis += linebreak;
        }

        return emojis;
    }

    renderToEmojiLines(palette: Palette = null): string[] {
        palette = palette ?? this.palette;

        const lines = [];
    
        for (let r = 0; r < this.rows; r++) {
            let line = "";
            for (let c = 0; c < this.columns; c++) {
                const i = r * this.columns + c;
    
                const [direction, fullness] = this.image[i];
    
                line += palette.getEmoji(direction, fullness);
            }
            lines.push(line);
        }

        return lines;
    }
}
