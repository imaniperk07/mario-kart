// ===============================
// Canvas Setup
// ===============================
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// ===============================
// Kart Object
// ===============================
var kart = {
    x: 120,
    y: 80,
    width: 30,
    height: 20,
    speed: 3
};

// ===============================
// Tracks (MADE OF MULTIPLE ROADS)
// ===============================
var currentTrack = 0;

var tracks = [
    {
        name: "Mushroom Circuit",
        roads: [
            { x: 80, y: 40, w: 440, h: 60 },
            { x: 460, y: 40, w: 60, h: 240 },
            { x: 80, y: 220, w: 440, h: 60 },
            { x: 80, y: 40, w: 60, h: 240 }
        ]
    },
    {
        name: "Desert Dash",
        roads: [
            { x: 100, y: 80, w: 400, h: 60 },
            { x: 300, y: 80, w: 60, h: 240 }
        ]
    },
    {
        name: "Rainbow Loop",
        roads: [
            { x: 120, y: 120, w: 360, h: 50 },
            { x: 120, y: 220, w: 360, h: 50 },
            { x: 120, y: 120, w: 50, h: 150 },
            { x: 430, y: 120, w: 50, h: 150 }
        ]
    }
];

// ===============================
// Keyboard Controls
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

    // Keep on screen
    if (kart.x < 0) kart.x = 0;
    if (kart.y < 0) kart.y = 0;
    if (kart.x + kart.width > canvas.width) {
        kart.x = canvas.width - kart.width;
    }
    if (kart.y + kart.height > canvas.height) {
        kart.y = canvas.height - kart.height;
    }

    // Switch tracks with T
    if (keys["t"]) {
        currentTrack++;
        if (currentTrack >= tracks.length) {
            currentTrack = 0;
        }
        kart.x = 120;
        kart.y = 80;
        keys["t"] = false;
    }
}

// ===============================
// Draw Track
// ===============================
function drawTrack() {
    // Grass background
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw road pieces
    ctx.fillStyle = "#777";
    var roadPieces = tracks[currentTrack].roads;

    for (var i = 0; i < roadPieces.length; i++) {
        var r = roadPieces[i];
        ctx.fillRect(r.x, r.y, r.w, r.h);
    }

    // Track name
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(tracks[currentTrack].name, 10, 20);
}

// ===============================
// Draw Kart
// ===============================
function drawKart() {
    // Kart body
    ctx.fillStyle = "red";
    ctx.fillRect(kart.x, kart.y + 6, 30, 14);

    // Driver head
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
