import { generateHPBarColor, round } from "./Util.js";
export function getHPBar(image, _hp) {
    let hp = round(_hp, 2);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = image.width;
    ctx.canvas.height = image.height;
    ctx.save();
    /* ctx.fillStyle = "#75ff40";
    if (hp === 1)
        ctx.fillStyle = "#0f0";
    if (hp < 0.5)
        ctx.fillStyle = "#e7f31e";
    if (hp < 0.2)
        ctx.fillStyle = "#df000b"; */
    const [red, green] = generateHPBarColor(hp);
    ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
    ctx.drawImage(image, 0, 0);
    if (hp > 0)
        ctx.fillRect(43, 5, hp * 100, 10);
    ctx.restore();
    return ctx.canvas;
}
export function createTextBox(image) {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = image.width;
    ctx.canvas.height = image.height;
    ctx.save();
    ctx.drawImage(image, 0, 0);
    ctx.restore();
    return ctx.canvas;
}
