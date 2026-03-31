// ===============================
// Canvas Setup
// ===============================
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// ===============================
// Kart Object
// ===============================
var kart = {
    x: 300,
    y: 200,
    width: 30,
    height: 20,
    speed: 4,
    dx: 0,
    dy: 0
};

// ===============================
// Track Data
// ===============================
var currentTrack = 0;

var tracks = [
    {
        name: "Mushroom Circuit",
        road: { x: 50, y: 50, width: 500, height: 300 }
    },
    {
        name: "Desert Dash",
        road: { x: 100, y: 80, width: 400, height: 240 }
    },
    {
        name: "Rainbow Loop",
        road: { x: 60, y: 100, width: 480, height: 200 }
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
// Update Game Logic
// ===============================
function update() {
    kart.dx = 0;
    kart.dy = 0;

    // Movement
    if (keys["ArrowUp"]) kart.dy = -kart.speed;
    if (keys["ArrowDown"]) kart.dy = kart.speed;
    if (keys["ArrowLeft"]) kart.dx = -kart.speed;
    if (keys["ArrowRight"]) kart.dx = kart.speed;

    kart.x += kart.dx;
    kart.y += kart.dy;

    // Keep kart on screen
    if (kart.x < 0) kart.x = 0;
    if (kart.y < 0) kart.y = 0;
    if (kart.x + kart.width > canvas.width) {
        kart.x = canvas.width - kart.width;
    }
    if (kart.y + kart.height > canvas.height) {
        kart.y = canvas.height - kart.height;
    }

    // Track switching (press T)
    if (keys["t"]) {
        currentTrack++;
        if (currentTrack >= tracks.length) {
            currentTrack = 0;
        }
        kart.x = 300;
        kart.y = 200;
        keys["t"] = false;
    }

    // Off-road slowdown
    var road = tracks[currentTrack].road;

    if (
        kart.x < road.x ||
        kart.x + kart.width > road.x + road.width ||
        kart.y < road.y ||
        kart.y + kart.height > road.y + road.height
    ) {
        kart.speed = 2; // grass
    } else {
        kart.speed = 4; // road
    }
}

// ===============================
// Draw Track
// ===============================
function drawTrack() {
    // Grass
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Road
    ctx.fillStyle = "#777";
    var road = tracks[currentTrack].road;
    ctx.fillRect(road.x, road.y, road.width, road.height);

    // Track Name
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
    ctx.fillRect(kart.x, kart.y + 5, 30, 15);

    // Driver head
    ctx.fillStyle = "#ffd1a9";
    ctx.beginPath();
    ctx.arc(kart.x + 15, kart.y, 7, 0, Math.PI * 2);
    ctx.fill();

    // Wheels
    ctx.fillStyle = "black";
    ctx.fillRect(kart.x - 4, kart.y + 5, 6, 10);
    ctx.fillRect(kart.x + 28, kart.y + 5, 6, 10);

    // Stripe
    ctx.fillStyle = "white";
    ctx.fillRect(kart.x + 5, kart.y + 8, 20, 3);
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
