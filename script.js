// ============================
// Canvas Setup
// ============================
const canvas = document.getElementById(“gameCanvas”);
const ctx = canvas.getContext(“2d”);

const WORLD_W = 1024;
const WORLD_H = 1024;

// ============================
// Colors
// ============================
const C = {
dirt:    “#b89a6a”,   // sandy/tan background
road:    “#888888”,   // gray asphalt
grass:   “#3aaa35”,   // bright green infield
curbR:   “#e02020”,
curbW:   “#ffffff”,
curbB:   “#2060e0”,
curbY:   “#e8c000”,
kartRed: “#e82020”,
kartYellow: “#ffe44d”,
finishW: “#ffffff”,
finishB: “#111111”,
};

// ============================
// Track geometry (scaled to 1024x1024 world)
// Outer road boundary path (centerline of road)
// Traced from reference image
// ============================

// The road is drawn as a wide stroked path.
// ROAD_WIDTH controls thickness of the gray asphalt.
const ROAD_WIDTH = 90;
const CURB_WIDTH = ROAD_WIDTH + 14; // slightly wider for the curb border

// Main track centerline — traced from reference image
// Starting top-left area, going clockwise
const trackPath = [
// Top-left curve start
{ x: 130, y: 440 },
{ x: 110, y: 380 },
{ x: 100, y: 300 },
{ x: 105, y: 220 },
{ x: 120, y: 160 },
{ x: 155, y: 105 },
{ x: 210, y: 72 },
{ x: 290, y: 58 },
// Long straight across top
{ x: 420, y: 58 },
{ x: 560, y: 70 },
{ x: 680, y: 95 },
{ x: 780, y: 130 },
// Top-right wide curve going down
{ x: 860, y: 180 },
{ x: 910, y: 250 },
{ x: 930, y: 340 },
{ x: 920, y: 430 },
{ x: 895, y: 510 },
// Right side straight going down
{ x: 875, y: 560 },
{ x: 870, y: 600 },
// Right section — finish line area
{ x: 875, y: 640 },
{ x: 880, y: 700 },
{ x: 875, y: 760 },
{ x: 860, y: 820 },
// Bottom-right curve
{ x: 820, y: 870 },
{ x: 760, y: 895 },
{ x: 690, y: 900 },
// Bottom curves (S-bend)
{ x: 620, y: 880 },
{ x: 560, y: 840 },
{ x: 510, y: 790 },
{ x: 480, y: 730 },
{ x: 475, y: 660 },
{ x: 490, y: 600 },
{ x: 520, y: 550 },
{ x: 540, y: 490 },
{ x: 530, y: 430 },
{ x: 500, y: 390 },
{ x: 450, y: 375 },
// Central section going left
{ x: 380, y: 375 },
{ x: 310, y: 385 },
// Bottom-left S-bend going down
{ x: 255, y: 420 },
{ x: 220, y: 470 },
{ x: 200, y: 530 },
{ x: 195, y: 600 },
{ x: 205, y: 660 },
{ x: 225, y: 720 },
{ x: 230, y: 760 },
// Bottom-left turn
{ x: 220, y: 800 },
{ x: 190, y: 830 },
{ x: 145, y: 840 },
{ x: 100, y: 820 },
// Left straight going up
{ x: 80, y: 760 },
{ x: 75, y: 680 },
{ x: 80, y: 610 },
{ x: 100, y: 540 },
{ x: 130, y: 480 },
{ x: 130, y: 440 }, // close path
];

// Green island shapes (infield grass patches, like reference)
const islands = [
// Top-left large rectangular island
{
points: [
{ x: 175, y: 160 },
{ x: 295, y: 160 },
{ x: 295, y: 200 },
{ x: 295, y: 390 },
{ x: 175, y: 390 },
]
},
// Lower-left step notch on that island
{
points: [
{ x: 175, y: 390 },
{ x: 255, y: 390 },
{ x: 255, y: 460 },
{ x: 175, y: 460 },
]
},
// Large central/right green area
{
points: [
{ x: 310, y: 160 },
{ x: 820, y: 160 },
{ x: 820, y: 390 },
{ x: 750, y: 390 },
{ x: 750, y: 490 },
{ x: 560, y: 490 },
{ x: 560, y: 390 },
{ x: 310, y: 390 },
]
},
// Right-side tall island
{
points: [
{ x: 750, y: 500 },
{ x: 820, y: 500 },
{ x: 820, y: 860 },
{ x: 750, y: 860 },
]
},
// Bottom-center small island
{
points: [
{ x: 300, y: 490 },
{ x: 460, y: 490 },
{ x: 460, y: 550 },
{ x: 300, y: 550 },
]
},
];

// ============================
// Curb helper — draw alternating colored curb
// ============================
function drawCurb(pathPts, width) {
const colors = [C.curbR, C.curbW, C.curbB, C.curbY];
const segLen = 18;
let dist = 0;
let colorIdx = 0;

ctx.save();
ctx.lineCap = “butt”;
ctx.lineJoin = “round”;

for (let i = 0; i < pathPts.length - 1; i++) {
const ax = pathPts[i].x, ay = pathPts[i].y;
const bx = pathPts[i+1].x, by = pathPts[i+1].y;
const segTotal = Math.hypot(bx - ax, by - ay);
let walked = 0;

```
while (walked < segTotal) {
  const remain = segTotal - walked;
  const draw = Math.min(segLen - (dist % segLen), remain);
  const t0 = walked / segTotal;
  const t1 = (walked + draw) / segTotal;

  ctx.strokeStyle = colors[Math.floor(dist / segLen) % colors.length];
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(ax + (bx - ax) * t0, ay + (by - ay) * t0);
  ctx.lineTo(ax + (bx - ax) * t1, ay + (by - ay) * t1);
  ctx.stroke();

  dist += draw;
  walked += draw;
}
```

}
ctx.restore();
}

// ============================
// Draw filled polygon
// ============================
function fillPoly(pts, color) {
ctx.beginPath();
ctx.moveTo(pts[0].x, pts[0].y);
for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
ctx.closePath();
ctx.fillStyle = color;
ctx.fill();
}

// ============================
// Stroke a path
// ============================
function strokePath(pts, width, color, close = false) {
ctx.beginPath();
ctx.moveTo(pts[0].x, pts[0].y);
for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
if (close) ctx.closePath();
ctx.lineWidth = width;
ctx.strokeStyle = color;
ctx.lineCap = “round”;
ctx.lineJoin = “round”;
ctx.stroke();
}

// ============================
// Island border curb
// ============================
function drawIslandCurb(pts) {
const closed = […pts, pts[0]];
drawCurb(closed, 10);
}

// ============================
// Finish line (right side, around x=875, y=575)
// ============================
const FINISH_X = 875;
const FINISH_Y_START = 555;
const FINISH_Y_END = 625;

function drawFinishLine() {
const tileH = 14;
const tileW = ROAD_WIDTH / 5;
let white = true;
for (let y = FINISH_Y_START; y < FINISH_Y_END; y += tileH) {
for (let col = 0; col < 5; col++) {
ctx.fillStyle = (white && col % 2 === 0) || (!white && col % 2 !== 0) ? C.finishW : C.finishB;
ctx.fillRect(FINISH_X - ROAD_WIDTH / 2 + col * tileW - 5, y, tileW, tileH);
}
white = !white;
}
}

// ============================
// Track draw (world space, no camera)
// ============================
function drawTrackWorld() {
// 1. Dirt background
ctx.fillStyle = C.dirt;
ctx.fillRect(0, 0, WORLD_W, WORLD_H);

// 2. Road (gray asphalt wide stroke)
ctx.save();
ctx.lineCap = “round”;
ctx.lineJoin = “round”;
ctx.lineWidth = ROAD_WIDTH;
ctx.strokeStyle = C.road;
ctx.beginPath();
ctx.moveTo(trackPath[0].x, trackPath[0].y);
for (let i = 1; i < trackPath.length; i++) ctx.lineTo(trackPath[i].x, trackPath[i].y);
ctx.closePath();
ctx.stroke();
ctx.restore();

// 3. Curb border on road edges
drawCurb([…trackPath, trackPath[0]], CURB_WIDTH);

// 4. Road on top (gray over curb to make curb look like border)
ctx.save();
ctx.lineCap = “round”;
ctx.lineJoin = “round”;
ctx.lineWidth = ROAD_WIDTH - 4;
ctx.strokeStyle = C.road;
ctx.beginPath();
ctx.moveTo(trackPath[0].x, trackPath[0].y);
for (let i = 1; i < trackPath.length; i++) ctx.lineTo(trackPath[i].x, trackPath[i].y);
ctx.closePath();
ctx.stroke();
ctx.restore();

// 5. Green islands
for (const island of islands) {
fillPoly(island.points, C.grass);
drawIslandCurb(island.points);
}

// 6. Finish line
drawFinishLine();

// 7. Decorative edge green corners (reference has green patches at map borders)
ctx.fillStyle = C.grass;
ctx.fillRect(0, 0, 60, 60);
ctx.fillRect(WORLD_W - 80, 0, 80, 120);
ctx.fillRect(WORLD_W - 80, 0, 80, 80);
ctx.fillRect(0, WORLD_H - 80, 180, 80);
ctx.fillRect(350, WORLD_H - 80, 140, 80);

// Border curb around entire map edges
const border = 6;
const edgePts = [
{x: border, y: border},
{x: WORLD_W - border, y: border},
{x: WORLD_W - border, y: WORLD_H - border},
{x: border, y: WORLD_H - border},
{x: border, y: border},
];
drawCurb(edgePts, 12);
}

// ============================
// Kart
// ============================
const kart = {
x: FINISH_X - 10,
y: FINISH_Y_START - 30,
angle: Math.PI * 1.5, // facing up initially
speed: 0,
maxSpeed: 4.5,
accel: 0.12,
brake: 0.18,
friction: 0.96,
turnSpeed: 0.045,
lap: 1,
totalLaps: 3,
// Finish line crossing detection
crossedFinish: false,
lastFinishDir: 0,
};

// ============================
// Camera
// ============================
const camera = { x: 0, y: 0 };

function updateCamera() {
camera.x = kart.x - canvas.width / 2;
camera.y = kart.y - canvas.height / 2;
}

// ============================
// Input
// ============================
const keys = {};
document.addEventListener(“keydown”, e => { keys[e.key] = true; e.preventDefault(); });
document.addEventListener(“keyup”,   e => { keys[e.key] = false; });

// ============================
// Update
// ============================
function update() {
// Acceleration / braking
if (keys[“ArrowUp”]) {
kart.speed = Math.min(kart.speed + kart.accel, kart.maxSpeed);
} else if (keys[“ArrowDown”]) {
kart.speed = Math.max(kart.speed - kart.brake, -kart.maxSpeed * 0.5);
} else {
kart.speed *= kart.friction;
}

// Turning (only when moving)
if (Math.abs(kart.speed) > 0.1) {
const dir = kart.speed > 0 ? 1 : -1;
if (keys[“ArrowLeft”])  kart.angle -= kart.turnSpeed * dir;
if (keys[“ArrowRight”]) kart.angle += kart.turnSpeed * dir;
}

kart.x += Math.cos(kart.angle) * kart.speed;
kart.y += Math.sin(kart.angle) * kart.speed;

updateCamera();

// Lap counter (simple: cross x≈875, y between 555-625 going upward)
if (kart.x > FINISH_X - 55 && kart.x < FINISH_X + 10 &&
kart.y > FINISH_Y_START && kart.y < FINISH_Y_END) {
if (!kart.crossedFinish) {
kart.crossedFinish = true;
if (kart.speed > 0) {
kart.lap = Math.min(kart.lap + 1, kart.totalLaps);
}
}
} else {
kart.crossedFinish = false;
}

// HUD update
const kmh = Math.abs(Math.round(kart.speed * 30));
document.getElementById(“speed-display”).textContent = kmh + “ km/h”;
document.getElementById(“lap-display”).textContent =
“LAP “ + Math.min(kart.lap, kart.totalLaps) + “ / “ + kart.totalLaps;
}

// ============================
// Draw Kart
// ============================
function drawKart() {
ctx.save();
// Transform to world position, then offset by camera
const sx = kart.x - camera.x;
const sy = kart.y - camera.y;
ctx.translate(sx, sy);
ctx.rotate(kart.angle);

// Shadow
ctx.fillStyle = “rgba(0,0,0,0.25)”;
ctx.beginPath();
ctx.ellipse(2, 4, 16, 8, 0, 0, Math.PI * 2);
ctx.fill();

// Kart body
ctx.fillStyle = C.kartRed;
ctx.beginPath();
ctx.roundRect(-14, -7, 28, 14, 3);
ctx.fill();

// Windshield
ctx.fillStyle = “rgba(200,230,255,0.8)”;
ctx.fillRect(0, -5, 8, 10);

// Driver head
ctx.fillStyle = “#ffc8a0”;
ctx.beginPath();
ctx.arc(2, 0, 5, 0, Math.PI * 2);
ctx.fill();

// Wheels
ctx.fillStyle = “#222”;
ctx.fillRect(-16, -10, 8, 5);  // back left
ctx.fillRect(-16,   5, 8, 5);  // back right
ctx.fillRect(  8, -10, 8, 5);  // front left
ctx.fillRect(  8,   5, 8, 5);  // front right

ctx.restore();
}

// ============================
// Pre-render track to offscreen canvas
// ============================
const trackCanvas = document.createElement(“canvas”);
trackCanvas.width = WORLD_W;
trackCanvas.height = WORLD_H;
const trackCtx = trackCanvas.getContext(“2d”);

// Temporarily redirect ctx drawing to trackCtx
const origCtx = ctx;
// We’ll draw track directly to trackCtx
(function preRenderTrack() {
const save = ctx;
// Manually draw to trackCtx
const c = trackCtx;

// Dirt background
c.fillStyle = C.dirt;
c.fillRect(0, 0, WORLD_W, WORLD_H);

// Road
c.save();
c.lineCap = “round”;
c.lineJoin = “round”;
c.lineWidth = ROAD_WIDTH;
c.strokeStyle = C.road;
c.beginPath();
c.moveTo(trackPath[0].x, trackPath[0].y);
for (let i = 1; i < trackPath.length; i++) c.lineTo(trackPath[i].x, trackPath[i].y);
c.closePath();
c.stroke();
c.restore();

// Curb (outer)
function curbOnCtx(pathPts, width) {
const colors = [C.curbR, C.curbW, C.curbB, C.curbY];
const segLen = 18;
let dist = 0;
c.save();
c.lineCap = “butt”;
c.lineJoin = “round”;
for (let i = 0; i < pathPts.length - 1; i++) {
const ax = pathPts[i].x, ay = pathPts[i].y;
const bx = pathPts[i+1].x, by = pathPts[i+1].y;
const segTotal = Math.hypot(bx - ax, by - ay);
let walked = 0;
while (walked < segTotal) {
const remain = segTotal - walked;
const draw = Math.min(segLen - (dist % segLen), remain);
const t0 = walked / segTotal;
const t1 = (walked + draw) / segTotal;
c.strokeStyle = colors[Math.floor(dist / segLen) % colors.length];
c.lineWidth = width;
c.beginPath();
c.moveTo(ax + (bx - ax) * t0, ay + (by - ay) * t0);
c.lineTo(ax + (bx - ax) * t1, ay + (by - ay) * t1);
c.stroke();
dist += draw;
walked += draw;
}
}
c.restore();
}

curbOnCtx([…trackPath, trackPath[0]], CURB_WIDTH);

// Road again on top
c.save();
c.lineCap = “round”;
c.lineJoin = “round”;
c.lineWidth = ROAD_WIDTH - 4;
c.strokeStyle = C.road;
c.beginPath();
c.moveTo(trackPath[0].x, trackPath[0].y);
for (let i = 1; i < trackPath.length; i++) c.lineTo(trackPath[i].x, trackPath[i].y);
c.closePath();
c.stroke();
c.restore();

// Green islands
function fillPolyC(pts, color) {
c.beginPath();
c.moveTo(pts[0].x, pts[0].y);
for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y);
c.closePath();
c.fillStyle = color;
c.fill();
}

for (const island of islands) {
fillPolyC(island.points, C.grass);
const closed = […island.points, island.points[0]];
curbOnCtx(closed, 10);
}

// Finish line
const tileH = 14, tileW = Math.floor(ROAD_WIDTH / 5);
let white = true;
for (let y = FINISH_Y_START; y < FINISH_Y_END; y += tileH) {
for (let col = 0; col < 5; col++) {
c.fillStyle = (white && col % 2 === 0) || (!white && col % 2 !== 0) ? C.finishW : C.finishB;
c.fillRect(FINISH_X - ROAD_WIDTH / 2 + col * tileW - 5, y, tileW, tileH);
}
white = !white;
}

// Border corners (green patches)
c.fillStyle = C.grass;
c.fillRect(0,            0,           80, 120);
c.fillRect(WORLD_W - 80, 0,           80, 140);
c.fillRect(WORLD_W - 80, 150,         80,  30);
c.fillRect(0,            WORLD_H - 80, 200, 80);
c.fillRect(360,          WORLD_H - 80, 140, 80);

// Outer map border curb
const edgePts = [
{x: 5, y: 5},
{x: WORLD_W - 5, y: 5},
{x: WORLD_W - 5, y: WORLD_H - 5},
{x: 5, y: WORLD_H - 5},
{x: 5, y: 5},
];
curbOnCtx(edgePts, 12);
})();

// ============================
// Main Render Loop
// ============================
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw pre-rendered track shifted by camera
ctx.drawImage(trackCanvas,
Math.round(camera.x), Math.round(camera.y), canvas.width, canvas.height,
0, 0, canvas.width, canvas.height
);

drawKart();
}

function loop() {
update();
draw();
requestAnimationFrame(loop);
}

loop();
