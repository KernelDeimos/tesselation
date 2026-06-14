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
    tileSize,
}) => {
    const data = [...dataDontMutate];

    const width = data.shift();
    const height = data.length / width;

    if ( height !== Math.floor(height) ) {
        throw new Error('grid size does not match')
    }

    log('rowheight', width, height);
    for ( let row=0 ; row < height ; row++ ) {
        for ( let col=0 ; col < width ; col++ ) {
            const color = [
                'white',
                'lightgray',
                'black',
            ][data[width*row + col]];
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
    renderSection({
        ctx,
        position: { x: 0, y: 0, },
        tileSize: { w: 30, h: 30 },
    })
};

document.addEventListener('DOMContentLoaded', main);
