// ============================
// Canvas Setup
// ============================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WORLD_W = 1024;
const WORLD_H = 1024;

const C = {
  dirt: "#b89a6a",
  road: "#888888",
  grass: "#3aaa35",
  curbR: "#e02020",
  curbW: "#ffffff",
  curbB: "#2060e0",
  curbY: "#e8c000",
  finishW: "#ffffff",
  finishB: "#111111",
};

const ROAD_WIDTH = 90;
const CURB_WIDTH = ROAD_WIDTH + 14;

// ============================
// Track Path
// ============================
const trackPath = [
  { x: 130, y: 440 }, { x: 110, y: 380 }, { x: 100, y: 300 },
  { x: 105, y: 220 }, { x: 120, y: 160 }, { x: 155, y: 105 },
  { x: 210, y: 72  }, { x: 290, y: 58  }, { x: 420, y: 58  },
  { x: 560, y: 70  }, { x: 680, y: 95  }, { x: 780, y: 130 },
  { x: 860, y: 180 }, { x: 910, y: 250 }, { x: 930, y: 340 },
  { x: 920, y: 430 }, { x: 895, y: 510 }, { x: 875, y: 560 },
  { x: 870, y: 600 }, { x: 875, y: 640 }, { x: 880, y: 700 },
  { x: 875, y: 760 }, { x: 860, y: 820 }, { x: 820, y: 870 },
  { x: 760, y: 895 }, { x: 690, y: 900 }, { x: 620, y: 880 },
  { x: 560, y: 840 }, { x: 510, y: 790 }, { x: 480, y: 730 },
  { x: 475, y: 660 }, { x: 490, y: 600 }, { x: 520, y: 550 },
  { x: 540, y: 490 }, { x: 530, y: 430 }, { x: 500, y: 390 },
  { x: 450, y: 375 }, { x: 380, y: 375 }, { x: 310, y: 385 },
  { x: 255, y: 420 }, { x: 220, y: 470 }, { x: 200, y: 530 },
  { x: 195, y: 600 }, { x: 205, y: 660 }, { x: 225, y: 720 },
  { x: 230, y: 760 }, { x: 220, y: 800 }, { x: 190, y: 830 },
  { x: 145, y: 840 }, { x: 100, y: 820 }, { x: 80,  y: 760 },
  { x: 75,  y: 680 }, { x: 80,  y: 610 }, { x: 100, y: 540 },
  { x: 130, y: 480 }, { x: 130, y: 440 },
];

// ============================
// Offscreen Track Canvas
// ============================
const trackCanvas = document.createElement("canvas");
trackCanvas.width = WORLD_W;
trackCanvas.height = WORLD_H;
const tc = trackCanvas.getContext("2d");

tc.fillStyle = C.dirt;
tc.fillRect(0, 0, WORLD_W, WORLD_H);

// --- Helper Drawing Functions ---
function strokeClosed(c, pts, width, color) {
  c.save();
  c.lineCap = "round";
  c.lineJoin = "round";
  c.lineWidth = width;
  c.strokeStyle = color;
  c.beginPath();
  c.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    c.lineTo(pts[i].x, pts[i].y);
  }
  c.closePath();
  c.stroke();
  c.restore();
}

strokeClosed(tc, trackPath, CURB_WIDTH, C.curbR);
strokeClosed(tc, trackPath, ROAD_WIDTH, C.road);

// ============================
// Kart
// ============================
const kart = {
  x: 875,
  y: 520,
  angle: Math.PI * 1.5,
  speed: 0,
  maxSpeed: 4.5,
  accel: 0.12,
  brake: 0.18,
  friction: 0.96,
  turnSpeed: 0.045,
  lap: 1,
  totalLaps: 3,
};

const camera = { x: 0, y: 0 };
const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ============================
// Update
// ============================
function update() {
  if (keys["ArrowUp"]) kart.speed = Math.min(kart.speed + kart.accel, kart.maxSpeed);
  else if (keys["ArrowDown"]) kart.speed = Math.max(kart.speed - kart.brake, -kart.maxSpeed * 0.5);
  else kart.speed *= kart.friction;

  if (Math.abs(kart.speed) > 0.1) {
    if (keys["ArrowLeft"]) kart.angle -= kart.turnSpeed;
    if (keys["ArrowRight"]) kart.angle += kart.turnSpeed;
  }

  kart.x += Math.cos(kart.angle) * kart.speed;
  kart.y += Math.sin(kart.angle) * kart.speed;

  camera.x = kart.x - canvas.width / 2;
  camera.y = kart.y - canvas.height / 2;

  document.getElementById("speed-display").textContent =
    Math.abs(Math.round(kart.speed * 30)) + " km/h";
  document.getElementById("lap-display").textContent =
    "LAP " + kart.lap + " / " + kart.totalLaps;
}

// ============================
// Draw
// ============================
function drawKart() {
  ctx.save();
  ctx.translate(kart.x - camera.x, kart.y - camera.y);
  ctx.rotate(kart.angle);

  ctx.fillStyle = "#e82020";
  ctx.fillRect(-14, -7, 28, 14);

  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(trackCanvas, camera.x, camera.y,
    canvas.width, canvas.height,
    0, 0,
    canvas.width, canvas.height);
  drawKart();
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
