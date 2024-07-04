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
  const refreshInterval = 1000 * 60 * 15; // 15m

  const minSystemSize = 3;
  const maxSystemSize = sk.windowHeight * 0.1;

  const refreshTimestampKey = "sketch-data-refresh-timestamp";
  const binDataKey = "sketch-bin-data";

  const date = new Date();

  date.setDate(date.getDate() - 1);

  let dataTimer;

  let entry = 0;

  let centrePoint = { lat: 0, lon: 0 };

  let zoom = 500000;

  let rotationAngle = 0;
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
    sk.rectMode(sk.CENTER);
    sk.frameRate(30);

    centreX = sk.windowWidth / 2;
    centreY = sk.windowHeight / 2;
    refreshData();
    // dataTimer = setInterval(() => {
    //   refreshData();
    // }, 1000 * 60);

    //   cV = 0.182;
  };

  sk.draw = () => {
    sk.background(BACKGROUND);
    sk.push();
    sk.translate(centreX, centreY);

    const data = sk.getItem(binDataKey) as
      | null
      | {
          id: string;
          data: BinSensorDataEntry[];
        }[];

    if (data) {
      let done = true;
      // Complete 1 full rotation (2 PI rads) every 5 seconds
      rotationAngle += ((2 * sk.PI) / 5) * (sk.deltaTime / 1000);
      data.forEach((bin, i) => {
        // bins can have different amounts of data
        // we want to start at the beginning and step through each entry and default to the last entry if no more data is available

        let binData;
        if (bin.data.length > entry) {
          done = done && false;
          binData = bin.data[entry];
        } else {
          binData = bin.data[bin.data.length - 1];
          done = done && true;
        }

        // change data entry every 300 millis
        if (done && sk.millis() % 300 === 0) {
          entry += 1;
        } else {
          entry = 0;
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

          const xx = x * zoom;
          const yy = y * zoom;
          // console.log(xx, yy)
          let systemSize = zoom / 25000;

          systemSize = systemSize > minSystemSize ? systemSize : minSystemSize;
          systemSize = systemSize < maxSystemSize ? systemSize : maxSystemSize;

          drawStarSystem(xx, yy, systemSize, i);
        }
      });
    }
    sk.pop();
  };

  // zoom when the user scrolls the mouse wheel.
  sk.mouseWheel = (event: WheelEvent) => {
    const zoomScrollAmount = 10000;

    if (event.deltaY > 0) {
      zoom += zoomScrollAmount;
    } else {
      if (zoom - zoomScrollAmount > 0) {
        zoom -= zoomScrollAmount;
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
   * @param t temperature 0.0 - 1.0 range.
   */
  function drawStar(x: number, y: number, d: number, t: number) {
    sk.push();
    sk.translate(x, y);
    sk.noStroke();

    if (t > 0.75) {
      sk.fill(CAROLINA_BLUE);
    } else if (t > 0.5) {
      sk.fill(PARCHMENT);
    } else if (t > 0.25) {
      sk.fill(CARROT_ORANGE);
    } else {
      sk.fill(CHESTNUT);
    }

    sk.circle(0, 0, d);

    sk.pop();
  }

  /**
   * Draws a star system to the canvas.
   *
   * @param x x-coordinate of the center of the apple core.
   * @param y y-coordinate of the center of the apple core.
   * @param s size - used as the diameter of the star.
   * @param r (optional) angle of rotation offset, defaults to 1.
   * @param p (optional) number of planets, defaults to 3.
   * @param t (optional) temperature of star 0.0 - 1.0 range, defaults to 0.
   */
  function drawStarSystem(
    x: number,
    y: number,
    s: number,
    r: number = 1,
    p = 3,
    t = 0
  ) {
    const orbits = Array.from(Array(p).keys()).map((i) => {
      const diameter = s * (2 + i) * 1.25;
      return {
        diameter,
        radius: diameter / 2,
        // rotation angle + small percentage variation based on planet + rotation offset of system + rotation offset based on planet
        angle: rotationAngle + (rotationAngle * (3 - i)) / p / 2 + r + i * 2,
      };
    });

    const planetSize = s / 2;
    const blankSpaceSize = s * 0.75;

    sk.noStroke();
    sk.push(); // 1
    sk.translate(x, y);

    // rings
    sk.push(); // 2
    sk.noFill();
    sk.stroke(FRENCH_MAUVE);
    orbits.forEach(({ diameter }) => {
      sk.circle(0, 0, diameter);
    });
    sk.pop(); // 2

    // blank spaces

    orbits.forEach(({ radius, angle }) => {
      sk.push(); // 3
      sk.rotate(angle);
      sk.translate(radius, 0);
      // blank space
      sk.fill(SPACE_CADET);
      sk.circle(0, 0, blankSpaceSize);
      sk.pop(); // 3
    });

    orbits.forEach(({ diameter, radius, angle }, i) => {
      sk.push();
      sk.rotate(angle);
      sk.translate(radius, 0);

      const planetAngle = angle + i + (rotationAngle * (3 - 1)) / 3;

      if (i === 0) {
        drawBottle(0, 0, planetSize, planetAngle);
      } else if (i % 2 === 0) {
        drawChipPacket(0, 0, planetSize, planetAngle);
      } else if (i === 1 || i % 3 === 0) {
        drawAppleCore(0, 0, planetSize, planetAngle);
      } else {
        drawBottle(0, 0, planetSize, planetAngle);
      }
      sk.pop();
    });

    drawStar(0, 0, s, t);

    sk.pop(); // 1
  }

  function refreshData() {
    // const lastRefresh = sk.getItem(refreshTimestampKey) as null | number;
    // const data = sk.getItem(binDataKey);
    // console.log("data", data);

    // console.log("lastRefresh", lastRefresh);
    // console.log("Date.now() - refreshInterval", Date.now() - refreshInterval);
    // console.log(
    //   "lastRefresh < Date.now() - refreshInterval",
    //   lastRefresh < Date.now() - refreshInterval
    // );

    // if (!data || !lastRefresh || lastRefresh < Date.now() - refreshInterval) {
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
          sk.storeItem(refreshTimestampKey, Date.now());
        }
      })
      .catch((e) => console.error("Could not refresh data: ", e));
  }
  // }
});
