// ===============================
// Canvas Setup
// ===============================
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// ===============================
// Kart
// ===============================
var kart = {
    x: 200,
    y: 120,
    width: 30,
    height: 20,
    speed: 3
};

// ===============================
// Tracks with BIOMES + LOOPS
// ===============================
var currentTrack = 0;

var tracks = [
    {
        name: "Mushroom Circuit",
        grass: "#4caf50",
        roadColor: "#808080",
        startX: 200,
        startY: 120,
        roads: [
            { x: 80, y: 50, w: 440, h: 60 },
            { x: 460, y: 50, w: 60, h: 260 },
            { x: 80, y: 250, w: 440, h: 60 },
            { x: 80, y: 50, w: 60, h: 260 }
        ]
    },
    {
        name: "Desert Dash",
        grass: "#e8d7a3",
        roadColor: "#9e9e9e",
        startX: 180,
        startY: 110,
        roads: [
            { x: 120, y: 80, w: 360, h: 60 },
            { x: 420, y: 80, w: 60, h: 180 },
            { x: 180, y: 200, w: 300, h: 60 },
            { x: 120, y: 80, w: 60, h: 180 }
        ]
    },
    {
        name: "Rainbow Loop",
        grass: "#6a5acd",
        roadColor: "#888",
        startX: 200,
        startY: 150,
        roads: [
            { x: 120, y: 120, w: 360, h: 50 },
            { x: 120, y: 240, w: 360, h: 50 },
            { x: 120, y: 120, w: 50, h: 170 },
            { x: 430, y: 120, w: 50, h: 170 }
        ]
    }
];

// ===============================
// Keyboard Input
// ===============================
var keys = {};

document.addEventListener("keydown", function (e) {
    keys[e.key] = true;
});

document.addEventListener("keyup", function (e) {
    keys[e.key] = false;
});

// ===============================
// Update Logic
// ===============================
function update() {
    if (keys["ArrowUp"]) kart.y -= kart.speed;
    if (keys["ArrowDown"]) kart.y += kart.speed;
    if (keys["ArrowLeft"]) kart.x -= kart.speed;
    if (keys["ArrowRight"]) kart.x += kart.speed;

    // Screen limits
    kart.x = Math.max(0, Math.min(canvas.width - kart.width, kart.x));
    kart.y = Math.max(0, Math.min(canvas.height - kart.height, kart.y));

    // Switch track
    if (keys["t"]) {
        currentTrack = (currentTrack + 1) % tracks.length;
        kart.x = tracks[currentTrack].startX;
        kart.y = tracks[currentTrack].startY;
        keys["t"] = false;
    }
}

// ===============================
// Draw a Single Road Segment
// ===============================
function drawRoadPiece(r, roadColor) {
    // Main road
    ctx.fillStyle = roadColor;
    ctx.fillRect(r.x, r.y, r.w, r.h);

    // Red & White curbs
    var curbSize = 6;

    // Top
    drawCurb(r.x, r.y, r.w, curbSize, true);
    // Bottom
    drawCurb(r.x, r.y + r.h - curbSize, r.w, curbSize, false);
    // Left
    drawCurb(r.x, r.y, curbSize, r.h, true);
    // Right
    drawCurb(r.x + r.w - curbSize, r.y, curbSize, r.h, false);

    // Center dashed line
    drawCenterLine(r);
}

// ===============================
// Draw Red/White Curbs
// ===============================
function drawCurb(x, y, w, h, startRed) {
    var stripe = 10;

    for (var i = 0; i < (w > h ? w : h); i += stripe) {
        ctx.fillStyle = startRed ? "red" : "white";
        if (w > h) {
            ctx.fillRect(x + i, y, stripe, h);
        } else {
            ctx.fillRect(x, y + i, w, stripe);
        }
        startRed = !startRed;
    }
}

// ===============================
// Draw Center Dashed Line
// ===============================
function drawCenterLine(r) {
    ctx.fillStyle = "white";

    var dashLength = 14;
    var gap = 10;

    if (r.w > r.h) {
        // Horizontal road
        var centerY = r.y + r.h / 2 - 2;
        for (var x = r.x + 10; x < r.x + r.w - 10; x += dashLength + gap) {
            ctx.fillRect(x, centerY, dashLength, 4);
        }
    } else {
        // Vertical road
        var centerX = r.x + r.w / 2 - 2;
        for (var y = r.y + 10; y < r.y + r.h - 10; y += dashLength + gap) {
            ctx.fillRect(centerX, y, 4, dashLength);
        }
    }
}

// ===============================
// Draw Track
// ===============================
function drawTrack() {
    var track = tracks[currentTrack];

    // Grass / biome
    ctx.fillStyle = track.grass;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Roads
    for (var i = 0; i < track.roads.length; i++) {
        drawRoadPiece(track.roads[i], track.roadColor);
    }

    // Track name
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(track.name, 10, 20);
}

// ===============================
// Draw Kart
// ===============================
function drawKart() {
    // Body
    ctx.fillStyle = "red";
    ctx.fillRect(kart.x, kart.y + 6, 30, 14);

    // Head
    ctx.fillStyle = "#ffd1a9";
    ctx.beginPath();
    ctx.arc(kart.x + 15, kart.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Wheels
    ctx.fillStyle = "black";
    ctx.fillRect(kart.x - 4, kart.y + 6, 6, 8);
    ctx.fillRect(kart.x + 28, kart.y + 6, 6, 8);
}

// ===============================
// Draw Everything
// ===============================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrack();
    drawKart();
}

// ===============================
// Game Loop
// ===============================
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
