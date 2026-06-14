const createDocumentCanvas = () => {
    const canvas = document.createElement('canvas');
    const body = document.body;
    body.appendChild(canvas);
    return canvas;
};

const log = (label, ...a) => {
    console.log(label ?? 'LOGGED VALUES', ...a);
    return a;
};

// If you look at the array below carefully you can kind of see
// the shape. Here's the same pattern with ASCII box drawing:
// ▓▓▒▓
// ░▓▓▓
// ▓▓▒▓
// ░▒▒▒
const repeatingSection = [
    4, // width
    0,0,1,0,
    2,0,0,0,
    0,0,1,0,
    2,1,1,1,
];

const renderSectionFn = dataDontMutate => ({
    ctx,
    position,
    areaSize,
    roll,
    colorRotate = v => v,
}) => {
    const data = [...dataDontMutate];

    const width = data.shift();
    const height = data.length / width;

    // "roll" the rows
    {
        const n = roll % 4;
        for ( let i=0; i < n; i++ ) {
            const bottom = Array(width).fill(1).map(() => data.pop())
                .reverse();
            console.log('bottom', bottom);
            data.unshift(...bottom);
        }
    }

    const tileSize = {
        w: areaSize.w / width,
        h: areaSize.h / height,
    };

    if ( height !== Math.floor(height) ) {
        throw new Error('grid size does not match')
    }

    log('rowheight', width, height);
    for ( let row=0 ; row < height ; row++ ) {
        for ( let col=0 ; col < width ; col++ ) {
            const colorIndex = colorRotate(
                data[width*row + col]
            );
            const color = [
                'white',
                'lightgray',
                'black',
            ][colorIndex];
            ctx.fillStyle = color;
            ctx.fillRect(...log(
                'fillRect',
                position.x + col*tileSize.w,
                position.y + row*tileSize.h,
                tileSize.w,
                tileSize.h,
            ));
        }
    }
};

const renderSection = renderSectionFn(repeatingSection);

const main = () => {
    const canvas = createDocumentCanvas();
    const ctx = canvas.getContext("2d");

    const macroSize = { w: 10, h: 5 };
    const areaSize = { w: 60, h: 60 };

    canvas.width = macroSize.w * areaSize.w;
    canvas.height = macroSize.h * areaSize.h;

    for ( let row=0 ; row < macroSize.h ; row++ ) {
        for ( let col=0 ; col < macroSize.w ; col++ ) {
            const mapping = [
                [
                    [0,1,2],
                    [2,1,0],
                ][col % 2],
                [
                    // [1,2,0],
                    [0,1,2],
                    [2,1,0],
                ][col % 2],
            ][row % 1];

            renderSection({
                ctx,
                position: { x: col*areaSize.w, y: row*areaSize.h },
                roll: col,
                areaSize,
                colorRotate: v => {
                    return mapping[v];
                },
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', main);
