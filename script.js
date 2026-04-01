// ============================
// Canvas Setup
// ============================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ============================
// Kart
// ============================
const kart = {
    x: 400,
    y: 300,
    speed: 3
};

// ============================
// Camera
// ============================
const camera = { x: 0, y: 0 };

// ============================
// Single Complex Track
// ============================
const track = {
    grass: "#4caf50",
    road: "#777",
    curbSize: 12,

    // Main road shape (polygon path)
    path: [
        { x: 200, y: 100 },
        { x: 600, y: 100 },
        { x: 650, y: 150 },
        { x: 650, y: 350 },
        { x: 600, y: 400 },
        { x: 300, y: 400 },
        { x: 250, y: 350 },
        { x: 250, y: 250 },
        { x: 450, y: 250 },
        { x: 500, y: 200 },
        { x: 500, y: 150 },
        { x: 200, y: 150 }
    ],
    width: 80
};

// ============================
// Input
// ============================
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ============================
// Update
// ============================
function update() {
    if (keys["ArrowUp"]) kart.y -= kart.speed;
    if (keys["ArrowDown"]) kart.y += kart.speed;
    if (keys["ArrowLeft"]) kart.x -= kart.speed;
    if (keys["ArrowRight"]) kart.x += kart.speed;

    camera.x = kart.x - canvas.width / 2;
    camera.y = kart.y - canvas.height / 2;
}

// ============================
// Draw Track Path
// ============================
function drawTrack() {
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Grass
    ctx.fillStyle = track.grass;
    ctx.fillRect(camera.x, camera.y, canvas.width * 2, canvas.height * 2);

    // Road
    ctx.strokeStyle = track.road;
    ctx.lineWidth = track.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(track.path[0].x, track.path[0].y);
    for (let i = 1; i < track.path.length; i++) {
        ctx.lineTo(track.path[i].x, track.path[i].y);
    }
    ctx.closePath();
    ctx.stroke();

    // Red/white curb (outside)
    ctx.strokeStyle = "red";
    ctx.lineWidth = track.width + track.curbSize * 2;
    ctx.stroke();

    // White curb overlay
    ctx.setLineDash([20, 20]);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.setLineDash([]);

    // Center dashed line
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.setLineDash([15, 20]);

    ctx.beginPath();
    ctx.moveTo(track.path[0].x, track.path[0].y);
    for (let i = 1; i < track.path.length; i++) {
        ctx.lineTo(track.path[i].x, track.path[i].y);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.setLineDash([]);

    ctx.restore();
}

// ============================
// Draw Kart
// ============================
function drawKart() {
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    ctx.fillStyle = "red";
    ctx.fillRect(kart.x - 12, kart.y - 5, 24, 10);

    ctx.fillStyle = "#ffd1a9";
    ctx.beginPath();
    ctx.arc(kart.x, kart.y - 10, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// ============================
// Main Render
// ============================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrack();
    drawKart();

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Mushroom Circuit", 10, 20);
}

// ============================
// Loop
// ============================
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
