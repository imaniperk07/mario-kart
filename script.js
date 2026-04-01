// ===============================
// Canvas Setup
// ===============================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===============================
// Kart
// ===============================
const kart = {
    x: 300,
    y: 300,
    width: 30,
    height: 20,
    speed: 3
};

// ===============================
// Camera (pseudo first-person)
// ===============================
const camera = {
    x: 0,
    y: 0
};

// ===============================
// Tracks (COMPLEX + LONG)
// ===============================
let currentTrack = 0;

const tracks = [
    {
        name: "Mushroom Circuit",
        grass: "#4caf50",
        road: "#7a7a7a",
        start: { x: 300, y: 300 },
        segments: [
            { x: 200, y: 100, w: 400, h: 60 },
            { x: 540, y: 100, w: 60, h: 300 },
            { x: 200, y: 340, w: 400, h: 60 },
            { x: 200, y: 100, w: 60, h: 300 },
            { x: 260, y: 200, w: 280, h: 60 }
        ]
    },
    {
        name: "Desert Dash",
        grass: "#e8d7a3",
        road: "#9a9a9a",
        start: { x: 250, y: 160 },
        segments: [
            { x: 150, y: 120, w: 500, h: 60 },
            { x: 590, y: 120, w: 60, h: 220 },
            { x: 300, y: 280, w: 350, h: 60 },
            { x: 300, y: 200, w: 60, h: 140 },
            { x: 150, y: 200, w: 210, h: 60 }
        ]
    },
    {
        name: "Rainbow Run",
        grass: "#5e4ca1",
        road: "#8f8f8f",
        start: { x: 400, y: 200 },
        segments: [
            { x: 200, y: 140, w: 500, h: 50 },
            { x: 650, y: 140, w: 50, h: 220 },
            { x: 250, y: 310, w: 450, h: 50 },
            { x: 200, y: 140, w: 50, h: 220 },
            { x: 280, y: 220, w: 350, h: 50 }
        ]
    }
];

// ===============================
// Keyboard Input
// ===============================
const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ===============================
// Update Logic
// ===============================
function update() {
    if (keys["ArrowUp"]) kart.y -= kart.speed;
    if (keys["ArrowDown"]) kart.y += kart.speed;
    if (keys["ArrowLeft"]) kart.x -= kart.speed;
    if (keys["ArrowRight"]) kart.x += kart.speed;

    // Switch tracks
    if (keys["t"]) {
        currentTrack = (currentTrack + 1) % tracks.length;
        kart.x = tracks[currentTrack].start.x;
        kart.y = tracks[currentTrack].start.y;
        keys["t"] = false;
    }

    // Camera follows kart
    camera.x = kart.x - canvas.width / 2;
    camera.y = kart.y - canvas.height / 2;
}

// ===============================
// Draw Road Segment (OUTSIDE CURBS)
// ===============================
function drawRoadSegment(seg, roadColor) {
    // Road
    ctx.fillStyle = roadColor;
    ctx.fillRect(seg.x, seg.y, seg.w, seg.h);

    const curb = 10;

    // Outside curbs
    drawStripe(seg.x - curb, seg.y - curb, seg.w + curb * 2, curb, true); // top
    drawStripe(seg.x - curb, seg.y + seg.h, seg.w + curb * 2, curb, false); // bottom
    drawStripe(seg.x - curb, seg.y, curb, seg.h, true); // left
    drawStripe(seg.x + seg.w, seg.y, curb, seg.h, false); // right

    drawCenterLine(seg);
}

// ===============================
// Red / White curb stripes
// ===============================
function drawStripe(x, y, w, h, startRed) {
    const size = 10;
    for (let i = 0; i < (w > h ? w : h); i += size) {
        ctx.fillStyle = startRed ? "red" : "white";
        if (w > h) ctx.fillRect(x + i, y, size, h);
        else ctx.fillRect(x, y + i, w, size);
        startRed = !startRed;
    }
}

// ===============================
// Center dashed line
// ===============================
function drawCenterLine(seg) {
    ctx.fillStyle = "white";
    if (seg.w > seg.h) {
        const y = seg.y + seg.h / 2 - 2;
        for (let x = seg.x + 10; x < seg.x + seg.w - 10; x += 24) {
            ctx.fillRect(x, y, 16, 4);
        }
    } else {
        const x = seg.x + seg.w / 2 - 2;
        for (let y = seg.y + 10; y < seg.y + seg.h - 10; y += 24) {
            ctx.fillRect(x, y, 4, 16);
        }
    }
}

// ===============================
// Draw World
// ===============================
function draw() {
    const track = tracks[currentTrack];

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Grass
    ctx.fillStyle = track.grass;
    ctx.fillRect(camera.x, camera.y, canvas.width * 2, canvas.height * 2);

    // Roads
    track.segments.forEach(seg => drawRoadSegment(seg, track.road));

    // Kart
    ctx.fillStyle = "red";
    ctx.fillRect(kart.x, kart.y + 6, 30, 14);

    ctx.fillStyle = "#ffd1a9";
    ctx.beginPath();
    ctx.arc(kart.x + 15, kart.y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.fillRect(kart.x - 4, kart.y + 6, 6, 8);
    ctx.fillRect(kart.x + 28, kart.y + 6, 6, 8);

    ctx.restore();

    // HUD
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(track.name, 10, 20);
}

// ===============================
// Game Loop
// ===============================
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
``
