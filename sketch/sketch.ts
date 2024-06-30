// Colours

const PARCHMENT = "#F3E9D2";
const PEACH = "#F7E3AF";
const CARROT_ORANGE = "#F18F01";
const CHESTNUT = "#C73E1D";
const AUTUMN_BROWN = "#541a0b";
const AMARANTH_PINK = "#E39EC1";
const FRENCH_MAUVE = "#C47AC0";
const CAROLINA_BLUE = "#84BCDA";
const PISTACHIO = "#B4DC7F";
const SPACE_CADET = "#2B2D42";
const LAVENDER_GREY = "#a3a6c9";
const BACKGROUND = SPACE_CADET;

// gravity
const g = 9.8;
const pixelsPerMetre = 3780;
const fps = 30;

const circleRadius = 5;

const melbLat = -37.814;
const melbLong = 144.96332;

const binDataKey = "sketch-bin-data";

let cX = 0;
let cY = 0;
let cV = 0;

let dataTimer;

function setup() {
  console.log("🚀 - Setup initialized - P5 is running");

  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER).noFill();
  frameRate(30);

  cX = windowWidth / 2;
  cY = windowHeight / 2;
  // refreshData();
  // dataTimer = setInterval(() => {
  //   refreshData();
  // }, 1000 * 60);

  //   cV = 0.182;
}

function draw() {
  //   if (cY > windowHeight - circleRadius) {
  //     // if (cV > 0.0001) {
  //     cV *= -0.8;
  //     // } else {
  //     //   cV = 0;
  //     //   cY = windowHeight - circleRadius
  //     // }
  //   }
  //   if (cV < 0.182) {
  //     cV = 0;
  //   }
  //   if (cV !== 0) {
  // cV += g / 30;
  //   }

  //   cY += cV;

  //   console.log("windowHeight - circleRadius", windowHeight - circleRadius);
  //   console.log("cV", cV);
  //   console.log("cY", cY);
  background(BACKGROUND);

  //   const data = getItem(binDataKey) as (null | BinSensorDataType)

  //   if (data) {
  //     for (const binData of data.results) {
  //         const bY =  (binData.lat_long && 'lat' in binData.lat_long) ? binData.lat_long.lat - melbLat : 0
  //         const bX =  (binData.lat_long && 'lon' in binData.lat_long) ? binData.lat_long.lon - melbLong : 0

  //         circle( windowWidth / 2 - (bX * 10000 ), windowHeight / 2 - (bY * 10000), circleRadius);

  //     }
  //   }

  drawBottle(windowWidth / 2 - 100, windowHeight / 2, 100, frameCount * 0.01);

  drawAppleCore(
    windowWidth / 2 + 100,
    windowHeight / 2,
    100,
    10 + frameCount * 0.01
  );

  drawChipPacket(
    windowWidth / 2,
    windowHeight / 2 - 200,
    100,
    20 + frameCount * 0.01
  );
}

/**
 * Draws a bottle to the canvas.
 *
 * @param x x-coordinate of the center of the bottle.
 * @param y y-coordinate of the center of the bottle.
 * @param s height of the bottle.
 * @param r (optional) rotation of the bottle.
 */
function drawBottle(x: number, y: number, s: number, r: number = 0) {
  const w = s * 0.42;
  const h = s;
  push();
  translate(x, y);
  rotate(r);
  noStroke();
  // plastic body
  fill(CAROLINA_BLUE);
  const rX = 0;
  const rW = w;

  const cX = 0;
  const cD = w;

  const eX = 0;
  const eW = w;
  const eH = w / 2;

  const rY = 0;
  const rH = h - (cD / 2 + eH / 2);

  const cY = rY - rH / 2;

  const eY = rY + rH / 2;

  circle(cX, cY, cD);
  rect(rX, rY, rW, rH);
  ellipse(eX, eY, eW, eH);

  // cap
  const capW = w / 3;
  const capH = w / 3;
  fill(PARCHMENT);
  rect(0, cY - cD / 2, capW, capH, w / 10);

  // label
  fill(FRENCH_MAUVE);
  const lH = rH / 2;
  const lrX = rY - lH / 3;
  rect(0, lrX, rW, lH);

  ellipse(0, lrX + lH / 2, eW, eH);
  fill(CAROLINA_BLUE);
  ellipse(0, lrX - lH / 2, eW, eH);

  pop();
}

/**
 * Draws an apple core to the canvas.
 *
 * @param x x-coordinate of the center of the apple core.
 * @param y y-coordinate of the center of the apple core.
 * @param s height of the apple core.
 * @param r (optional) rotation of the apple core.
 */
function drawAppleCore(x: number, y: number, s: number, r: number = 0) {
  const h = s * 0.6;

  const w = h / 2;
  push();
  translate(x, y);
  rotate(r);
  noStroke();

  const seH = w / 3;
  const rH = h - seH / 2;

  // bottom skin

  fill(PISTACHIO);
  rect(0, rH / 2, w, seH, s / 10);

  // apple flesh
  fill(PEACH);
  rect(0, 0, w, rH);
  fill(BACKGROUND);
  ellipse(-(w / 2), 0, w / 2, h);
  ellipse(w / 2, 0, w / 2, h);

  // top skin
  fill(PISTACHIO);
  ellipse(0, -rH / 2, w, seH);

  // stalk
  fill(AUTUMN_BROWN);
  const sH = s / 5;
  push();
  translate(0, -rH / 2 - sH / 2);
  rotate(0.2);
  rect(0, 0, sH / 3, sH);
  pop();

  // pip
  push();
  rotate(-0.2);
  ellipse(w / 15, -w / 12, w / 6, w / 4);
  pop();
  pop();
}

/**
 * Draws an apple core to the canvas.
 *
 * @param x x-coordinate of the center of the apple core.
 * @param y y-coordinate of the center of the apple core.
 * @param s height of the apple core.
 * @param r (optional) rotation of the apple core.
 */
function drawChipPacket(x: number, y: number, s: number, r: number = 0) {
  const h = s * 0.8;

  const w = h * 0.8;
  push();
  translate(x, y);
  rotate(r);
  noStroke();

  // packet
  fill(AMARANTH_PINK);

  const feH = s / 5;

  const rH = h - feH / 2;
  rect(0, feH / 2, w, rH);

  // top foil
  // fill(SPACE_CADET)

  // const gap = feH / 8
  // rect(0, - (rH /2 ) + feH / 2 + gap, w + gap * 2, feH, feH / 2)

  fill(LAVENDER_GREY);

  rect(0, -(rH / 2) + feH / 2, w, feH, feH / 2);

  // bottom foil

  const bfrH = feH / 3;

  rect(0, rH / 2 + feH / 2 - bfrH / 2, w, bfrH);

  // label

  fill(FRENCH_MAUVE);

  rect(0, 0 + feH / 2, w / 2, w / 3, s / 10);

  pop();
}

function refreshData() {
  getBinSensorData()
    .then((data) => {
      if (data) {
        console.log(data);
        storeItem(binDataKey, data);
      }
    })
    .catch((e) => console.error("Could not refresh data: ", e));
}
