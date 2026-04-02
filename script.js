// ============================
// Canvas Setup
// ============================
const canvas = document.getElementById(“gameCanvas”);
const ctx = canvas.getContext(“2d”);

const WORLD_W = 1024;
const WORLD_H = 1024;

const C = {
dirt:    “#b89a6a”,
road:    “#888888”,
grass:   “#3aaa35”,
curbR:   “#e02020”,
curbW:   “#ffffff”,
curbB:   “#2060e0”,
curbY:   “#e8c000”,
finishW: “#ffffff”,
finishB: “#111111”,
};

const ROAD_WIDTH = 90;
const CURB_WIDTH = ROAD_WIDTH + 14;

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

const islands = [
{ points: [{ x:175,y:160 },{ x:295,y:160 },{ x:295,y:390 },{ x:175,y:390 }] },
{ points: [{ x:175,y:390 },{ x:255,y:390 },{ x:255,y:460 },{ x:175,y:460 }] },
{ points: [{ x:310,y:160 },{ x:820,y:160 },{ x:820,y:390 },{ x:750,y:390 },{ x:750,y:490 },{ x:560,y:490 },{ x:560,y:390 },{ x:310,y:390 }] },
{ points: [{ x:750,y:500 },{ x:820,y:500 },{ x:820,y:860 },{ x:750,y:860 }] },
{ points: [{ x:300,y:490 },{ x:460,y:490 },{ x:460,y:550 },{ x:300,y:550 }] },
];

const FINISH_X = 875;
const FINISH_Y_START = 555;
const FINISH_Y_END   = 625;

function curbOnCtx(c, pts, width) {
const colors = [C.curbR, C.curbW, C.curbB, C.curbY];
const segLen = 18;
let dist = 0;
c.save(); c.lineCap = “butt”; c.lineJoin = “round”;
for (let i = 0; i < pts.length - 1; i++) {
const ax=pts[i].x, ay=pts[i].y, bx=pts[i+1].x, by=pts[i+1].y;
const total = Math.hypot(bx-ax, by-ay);
let walked = 0;
while (walked < total) {
const draw = Math.min(segLen - (dist % segLen), total - walked);
const t0 = walked/total, t1 = (walked+draw)/total;
c.strokeStyle = colors[Math.floor(dist/segLen) % colors.length];
c.lineWidth = width;
c.beginPath();
c.moveTo(ax+(bx-ax)*t0, ay+(by-ay)*t0);
c.lineTo(ax+(bx-ax)*t1, ay+(by-ay)*t1);
c.stroke();
dist += draw; walked += draw;
}
}
c.restore();
}

function fillPolyC(c, pts, color) {
c.beginPath(); c.moveTo(pts[0].x, pts[0].y);
for (let i=1;i<pts.length;i++) c.lineTo(pts[i].x, pts[i].y);
c.closePath(); c.fillStyle = color; c.fill();
}

function strokeClosedC(c, pts, width, color) {
c.save(); c.lineCap=“round”; c.lineJoin=“round”;
c.lineWidth=width; c.strokeStyle=color;
c.beginPath(); c.moveTo(pts[0].x, pts[0].y);
for (let i=1;i<pts.length;i++) c.lineTo(pts[i].x, pts[i].y);
c.closePath(); c.stroke(); c.restore();
}

// Build offscreen track
const trackCanvas = document.createElement(“canvas”);
trackCanvas.width = WORLD_W; trackCanvas.height = WORLD_H;
const tc = trackCanvas.getContext(“2d”);

tc.fillStyle = C.dirt;
tc.fillRect(0, 0, WORLD_W, WORLD_H);

strokeClosedC(tc, trackPath, CURB_WIDTH, C.curbR);
curbOnCtx(tc, […trackPath, trackPath[0]], CURB_WIDTH);
strokeClosedC(tc, trackPath, ROAD_WIDTH, C.road);

for (const isl of islands) {
fillPolyC(tc, isl.points, C.grass);
curbOnCtx(tc, […isl.points, isl.points[0]], 10);
}

// Finish line checkerboard
const tileH = 14, tileW = Math.floor(ROAD_WIDTH / 5);
let white = true;
for (let y = FINISH_Y_START; y < FINISH_Y_END; y += tileH) {
for (let col = 0; col < 5; col++) {
tc.fillStyle = (white ? col%2===0 : col%2!==0) ? C.finishW : C.finishB;
tc.fillRect(FINISH_X - Math.floor(ROAD_WIDTH/2) + col*tileW, y, tileW, tileH);
}
white = !white;
}

// Green corners
tc.fillStyle = C.grass;
tc.fillRect(0, 0, 80, 120);
tc.fillRect(WORLD_W-80, 0, 80, 140);
tc.fillRect(0, WORLD_H-80, 200, 80);
tc.fillRect(360, WORLD_H-80, 140, 80);

// Border curb
curbOnCtx(tc, [
{x:6,y:6}, {x:WORLD_W-6,y:6},
{x:WORLD_W-6,y:WORLD_H-6}, {x:6,y:WORLD_H-6}, {x:6,y:6}
], 12);

// ============================
// Kart
// ============================
const kart = {
x: FINISH_X - 10, y: FINISH_Y_START - 40,
angle: Math.PI * 1.5, speed: 0,
maxSpeed: 4.5, accel: 0.12, brake: 0.18,
friction: 0.96, turnSpeed: 0.045,
lap: 1, totalLaps: 3, crossedFinish: false,
};

const camera = { x: 0, y: 0 };
function updateCamera() {
camera.x = Math.round(kart.x - canvas.width  / 2);
camera.y = Math.round(kart.y - canvas.height / 2);
}

const keys = {};
document.addEventListener(“keydown”, e => { keys[e.key] = true;  e.preventDefault(); });
document.addEventListener(“keyup”,   e => { keys[e.key] = false; });

function update() {
if (keys[“ArrowUp”])   kart.speed = Math.min(kart.speed + kart.accel,  kart.maxSpeed);
else if (keys[“ArrowDown”]) kart.speed = Math.max(kart.speed - kart.brake, -kart.maxSpeed*0.5);
else kart.speed *= kart.friction;

if (Math.abs(kart.speed) > 0.1) {
const dir = kart.speed > 0 ? 1 : -1;
if (keys[“ArrowLeft”])  kart.angle -= kart.turnSpeed * dir;
if (keys[“ArrowRight”]) kart.angle += kart.turnSpeed * dir;
}

kart.x += Math.cos(kart.angle) * kart.speed;
kart.y += Math.sin(kart.angle) * kart.speed;
updateCamera();

if (kart.x > FINISH_X-55 && kart.x < FINISH_X+10 &&
kart.y > FINISH_Y_START && kart.y < FINISH_Y_END) {
if (!kart.crossedFinish && kart.speed > 0) {
kart.lap = Math.min(kart.lap + 1, kart.totalLaps);
kart.crossedFinish = true;
}
} else { kart.crossedFinish = false; }

document.getElementById(“speed-display”).textContent = Math.abs(Math.round(kart.speed*30)) + “ km/h”;
document.getElementById(“lap-display”).textContent   = “LAP “ + kart.lap + “ / “ + kart.totalLaps;
}

function drawKart() {
ctx.save();
ctx.translate(kart.x - camera.x, kart.y - camera.y);
ctx.rotate(kart.angle);

ctx.fillStyle = “rgba(0,0,0,0.3)”;
ctx.beginPath(); ctx.ellipse(2,5,16,7,0,0,Math.PI*2); ctx.fill();

ctx.fillStyle = “#e82020”;
ctx.beginPath(); ctx.roundRect(-14,-7,28,14,3); ctx.fill();

ctx.fillStyle = “rgba(180,220,255,0.85)”;
ctx.fillRect(1,-5,8,10);

ctx.fillStyle = “#ffc8a0”;
ctx.beginPath(); ctx.arc(3,0,5,0,Math.PI*2); ctx.fill();

ctx.fillStyle = “#222”;
ctx.fillRect(-16,-11,7,5); ctx.fillRect(-16,6,7,5);
ctx.fillRect(9,-11,7,5);   ctx.fillRect(9,6,7,5);

ctx.restore();
}

function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
const cx = Math.max(0, Math.min(camera.x, WORLD_W - canvas.width));
const cy = Math.max(0, Math.min(camera.y, WORLD_H - canvas.height));
ctx.drawImage(trackCanvas, cx, cy, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
drawKart();
}

function loop() { update(); draw(); requestAnimationFrame(loop); }
loop();
