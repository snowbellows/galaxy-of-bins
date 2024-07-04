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

let p5BinSketch = new p5(function sketch(sk: p5) {
  // gravity
  const g = 9.8;
  const pixelsPerMetre = 3780;
  const fps = 30;

  const circleRadius = 5;

  const melbLat = -37.814;
  const melbLong = 144.96332;

  const binDataKey = "sketch-bin-data";

  const date = new Date();

  date.setDate(date.getDate() - 1);

  const flindersStStation = { lat: -37.81854975968999, lon: 144.9637863723553 };

  let cX = 0;
  let cY = 0;
  let cV = 0;

  let dataTimer;

  let entry = 0;

  let centrePoint = { lat: 0, lon: 0 };

  let zoom = 500000;
  let starSystemSize = 20;

  let centreX = 0;
  let centreY = 0;

  function differenceLatLon(
    ll0: { lat: number; lon: number },
    ll1: { lat: number; lon: number }
  ): { lat: number; lon: number } {
    return { lat: ll0.lat - ll1.lat, lon: ll0.lon - ll1.lon };
  }

  sk.setup = () => {
    console.log("🚀 - Setup initialized - P5 is running");

    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    sk.rectMode(sk.CENTER).noFill();
    sk.frameRate(30);

    cX = sk.windowWidth / 2;
    cY = sk.windowHeight / 2;
    refreshData();
    // dataTimer = setInterval(() => {
    //   refreshData();
    // }, 1000 * 60);

    //   cV = 0.182;
  };

  sk.draw = () => {
    sk.background(BACKGROUND);

    const data = sk.getItem(binDataKey) as
      | null
      | {
          id: string;
          data: BinSensorDataEntry[];
        }[];

    if (data) {
      let done = true;
      data.forEach((bin, i) => {
        let binData;
        if (bin.data.length > entry) {
          done = done && false;
          binData = bin.data[entry];
        } else {
          binData = bin.data[bin.data.length - 1];
          done = done && true;
        }
        if (
          binData.lat_long &&
          "lon" in binData.lat_long &&
          "lat" in binData.lat_long
        ) {
          const { lon: x, lat: y } = differenceLatLon(
            centrePoint,
            binData.lat_long
          );

          const xx = sk.windowWidth / 2 - x * zoom + centreX;
          const yy = sk.windowHeight / 2 - y * zoom + centreY;
          // console.log(xx, yy)
          drawStarSystem(xx, yy, starSystemSize, 10 + i);
        }
      });
    }
  };

  // zoom when the user scrolls the mouse wheel.
  sk.mouseWheel = (event: WheelEvent) => {
    const zoomScrollAmount = 20000;
    const starSystemScrollAmount = 1;

    if (event.deltaY > 0) {
      zoom += zoomScrollAmount;
      starSystemSize += starSystemScrollAmount;
    } else {
      zoom -= zoomScrollAmount;
      if (starSystemSize - starSystemScrollAmount > 0) {
        starSystemSize -= starSystemScrollAmount;
      }
    }

    return false;
  };

  sk.mouseDragged = (event: MouseEvent) => {
    centreX += event.movementX;
    centreY += event.movementY;
  };

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
    sk.push();
    sk.translate(x, y);
    sk.rotate(r);
    sk.noStroke();

    // plastic body
    sk.fill(CAROLINA_BLUE);
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

    sk.circle(cX, cY, cD);
    sk.rect(rX, rY, rW, rH);
    sk.ellipse(eX, eY, eW, eH);

    // cap
    const capW = w / 3;
    const capH = w / 3;
    sk.fill(PARCHMENT);
    sk.rect(0, cY - cD / 2, capW, capH, w / 10);

    // label
    sk.fill(FRENCH_MAUVE);
    const lH = rH / 2;
    const lrX = rY - lH / 3;
    sk.rect(0, lrX, rW, lH);

    sk.ellipse(0, lrX + lH / 2, eW, eH);
    sk.fill(CAROLINA_BLUE);
    sk.ellipse(0, lrX - lH / 2, eW, eH);

    sk.pop();
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
    sk.push();
    sk.translate(x, y);
    sk.rotate(r);
    sk.noStroke();

    const seH = w / 3;
    const rH = h - seH / 2;

    // bottom skin

    sk.fill(PISTACHIO);
    sk.rect(0, rH / 2, w, seH, s / 10);

    // apple flesh
    sk.fill(PEACH);
    sk.rect(0, 0, w, rH);
    sk.fill(BACKGROUND);
    sk.ellipse(-(w / 2), 0, w / 2, h);
    sk.ellipse(w / 2, 0, w / 2, h);

    // top skin
    sk.fill(PISTACHIO);
    sk.ellipse(0, -rH / 2, w, seH);

    // stalk
    sk.fill(AUTUMN_BROWN);
    const sH = s / 5;
    sk.push();
    sk.translate(0, -rH / 2 - sH / 2);
    sk.rotate(0.2);
    sk.rect(0, 0, sH / 3, sH);
    sk.pop();

    // pip
    sk.push();
    sk.rotate(-0.2);
    sk.ellipse(w / 15, -w / 12, w / 6, w / 4);
    sk.pop();
    sk.pop();
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
    sk.push();
    sk.translate(x, y);
    sk.rotate(r);
    sk.noStroke();

    // packet
    sk.fill(AMARANTH_PINK);

    const feH = s / 5;

    const rH = h - feH / 2;
    sk.rect(0, feH / 2, w, rH);

    // top foil
    // fill(SPACE_CADET)

    // const gap = feH / 8
    // rect(0, - (rH /2 ) + feH / 2 + gap, w + gap * 2, feH, feH / 2)

    sk.fill(LAVENDER_GREY);

    sk.rect(0, -(rH / 2) + feH / 2, w, feH, feH / 2);

    // bottom foil

    const bfrH = feH / 3;

    sk.rect(0, rH / 2 + feH / 2 - bfrH / 2, w, bfrH);

    // label

    sk.fill(FRENCH_MAUVE);

    sk.rect(0, 0 + feH / 2, w / 2, w / 3, s / 10);

    sk.pop();
  }

  /**
   * Draws a star to the canvas.
   *
   * @param x x-coordinate of the center of the apple core.
   * @param y y-coordinate of the center of the apple core.
   * @param d diameter of the star.
   * @param b (optional) brightness 0.0 - 1.0 range.
   */
  function drawStar(x: number, y: number, d: number, b: number) {
    sk.push();
    sk.translate(x, y);
    sk.noStroke();

    if (b > 0.75) {
      sk.fill(CAROLINA_BLUE);
    } else if (b > 0.5) {
      sk.fill(PARCHMENT);
    } else if (b > 0.25) {
      sk.fill(CARROT_ORANGE);
    } else {
      sk.fill(CHESTNUT);
    }

    sk.circle(0, 0, d);

    sk.pop();
  }

  function drawStarSystem(x: number, y: number, s: number, r: number = 10) {
    sk.noStroke();
    sk.push(); // 1
    sk.translate(x, y);

    sk.push(); // 2
    // rings
    sk.noFill();
    sk.stroke(FRENCH_MAUVE);
    sk.circle(0, 0, s * 2);
    sk.circle(0, 0, s * 3);
    sk.circle(0, 0, s * 4);

    sk.pop(); // 2

    sk.push(); // 3
    sk.rotate(r + sk.frameCount * 0.003 * r);
    // blank space
    sk.fill(SPACE_CADET);
    sk.circle(s, 0, s * 0.75);
    sk.pop(); // 3

    sk.push(); //  4
    sk.rotate(r + 10 + sk.frameCount * 0.002 * r);
    // blank space
    sk.fill(SPACE_CADET);
    sk.circle(s * 1.5, 0, s * 0.75);
    sk.pop(); // 4

    sk.push(); // 5
    sk.rotate(r + 20 + sk.frameCount * 0.001 * r);
    // blank space
    sk.fill(SPACE_CADET);
    sk.circle(s * 2, 0, s * 0.75);
    sk.pop(); // 5

    sk.push(); // 6
    sk.rotate(r + sk.frameCount * 0.003 * r);
    drawBottle(s, 0, s / 2, r + sk.frameCount * 0.001 * r);
    sk.pop(); // 6

    sk.push(); // 7
    sk.rotate(r + 10 + sk.frameCount * 0.002 * r);
    drawAppleCore(s * 1.5, 0, s / 2, r + 10 + sk.frameCount * 0.001 * r);
    sk.pop(); // 7

    sk.push(); // 8
    sk.rotate(r + 20 + sk.frameCount * 0.001 * r);
    drawChipPacket(s * 2, 0, s / 2, r + 20 + sk.frameCount * 0.001 * r);
    sk.pop(); // 8

    drawStar(0, 0, s, ((r + sk.frameCount) % 60) / 60);

    sk.pop(); // 1
  }

  function refreshData() {
    getBinSensorDataForDate(date)
      .then((data) => {
        if (data) {
          const filteredData = data.filter((d) => d.data[0].lat_long !== null);
          const { lat, lon } = filteredData.reduce(
            (acc, d) => {
              const dll = d.data[0].lat_long;
              return { lat: acc.lat + dll.lat, lon: acc.lon + dll.lon };
            },
            { lat: 0, lon: 0 }
          );

          centrePoint = {
            lat: lat / filteredData.length,
            lon: lon / filteredData.length,
          };

          console.log("centrePoint", centrePoint);

          console.log(filteredData);
          sk.storeItem(binDataKey, filteredData);
        }
      })
      .catch((e) => console.error("Could not refresh data: ", e));
  }
});
