function draw_log() {
    context.drawImage(base,0,0);
    context.font = "12pt 'Runescape Small'"
    context.fillStyle="black";
    context.textAlign="left";
    context.textBaseline = "hanging";
    let text_width = context.measureText(text.value).width;
    let x = Math.floor(canvas.width / 2) - Math.floor(text_width / 2);
    let y = 65;
    context.fillText(text.value, x+1, y+1);
    context.fillStyle="white";
    context.fillText(text.value, x, y);
}

let text = document.getElementById("text");
let canvas = document.getElementById("log");
let context = canvas.getContext("2d", {alpha: false});
base = new Image();
base.src = './blank.png';
context.imageSmoothingEnabled = false;

base.onload = () => {
    text.disabled = false;
    context.drawImage(base,0,0);
}
text.oninput = () => {
    if (!text.disabled) {
        draw_log();
    }
}