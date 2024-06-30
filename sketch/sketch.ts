// Colours

const PARCHMENT = "#F3E9D2";
const PEACH = "#F7E3AF";
const CARROT_ORANGE = "#F18F01";
const CHESTNUT = "#C73E1D";
const AMARANTH_PINK = "#E39EC1";
const FRENCH_MAUVE = "#C47AC0";
const CAROLINA_BLUE = "#84BCDA";
const SPACE_CADET = "#2B2D42";
const BACKGROUND = SPACE_CADET

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
  refreshData();
  dataTimer = setInterval(() => {
    refreshData();
  }, 1000 * 60);

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

  fill("orange");

  //   const data = getItem(binDataKey) as (null | BinSensorDataType)

  //   if (data) {
  //     for (const binData of data.results) {
  //         const bY =  (binData.lat_long && 'lat' in binData.lat_long) ? binData.lat_long.lat - melbLat : 0
  //         const bX =  (binData.lat_long && 'lon' in binData.lat_long) ? binData.lat_long.lon - melbLong : 0

  //         circle( windowWidth / 2 - (bX * 10000 ), windowHeight / 2 - (bY * 10000), circleRadius);

  //     }
  //   }

  drawBottle(windowWidth / 2, windowHeight / 2, 100, frameCount * 0.01);
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
  const w = s / 2;
  const h = s;
  push();
  translate(x, y);
  rotate(r)
  noStroke();
  // plastic body
  fill(CAROLINA_BLUE);
  const rX = 0;
  const rW = w;
  const rH = h - w / 2;

  const cX = 0;
  const cD = w;

  const eX = 0;
  const eW = w;
  const eH = w / 2;

  const rY = h - (cD / 2 + eH / 2);

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
    fill(CHESTNUT)
    const lH = rH/2
    const lrX = rY - lH / 3
    rect(0, lrX, rW, lH)

    ellipse(0, lrX + lH / 2, eW, eH);
    fill(CAROLINA_BLUE)
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
    const w = s / 2;
    const h = s;
    push();
    translate(x, y);
    rotate(frameCount * 0.01)
    noStroke();
    
  
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
