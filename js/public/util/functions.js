export function createCanvas(size) {
    const cnv = document.createElement('canvas');
    const ctx = cnv.getContext('2d');
    cnv.width = size.x;
    cnv.height = size.y;
    return { cnv, ctx };
}
