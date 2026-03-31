var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var kart = {
    x: 300,
    y: 200,
    width: 30,
    height: 20,
    speed: 4,
    dx: 0,
    dy: 0
};

var keys = {};

document.addEventListener("keydown", function(e) {
    keys[e.key] = true;
});

document.addEventListener("keyup", function(e) {
    keys[e.key] = false;
});

function update() {
    kart.dx = 0;
    kart.dy = 0;

    if (keys["ArrowUp"]) kart.dy = -kart.speed;
    if (keys["ArrowDown"]) kart.dy = kart.speed;
    if (keys["ArrowLeft"]) kart.dx = -kart.speed;
    if (keys["ArrowRight"]) kart.dx = kart.speed;

    kart.x += kart.dx;
    kart.y += kart.dy;

    if (kart.x < 0) kart.x = 0;
    if (kart.y < 0) kart.y = 0;
    if (kart.x + kart.width > canvas.width) {
        kart.x = canvas.width - kart.width;
    }
    if (kart.y + kart.height > canvas.height) {
        kart.y = canvas.height - kart.height;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#888";
    ctx.fillRect(50, 50, 500, 300);

    ctx.fillStyle = "red";
    ctx.fillRect(kart.x, kart.y, kart.width, kart.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
``
