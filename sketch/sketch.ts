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
  const refreshInterval = 1000 * 60 * 60; // 1h

  const maxPlanets = 4;

  const minSystemSize = 3;
  const maxSystemSize = sk.windowHeight * 0.1;

  const refreshTimestampKey = "sketch-data-refresh-timestamp";
  const binDataKey = "sketch-bin-data";
  const centrePointKey = "sketch-bin-centre-point";
  // const textKey = "sketch-bin-text";

  const date = new Date();

  date.setDate(date.getDate() - 5);

  let dataTimer;

  let entry = 0;
  let entryCounter = 0;

  let startZoom = 1000000;
  let zoom = 1000000;
  const minZoom = 200000;
  const maxZoom = 2400000;

  let textY = 0;
  let textPage = 0;
  const textHeight = 16;

  let rotationAngle = 0;
  let centreX = 0;
  let centreY = 0;

  let reverse = false;

  let touchDrag = [0, 0];

  let bgImage: undefined | p5.Image;

  let highlightedBin = 0;

  let zoomTransitionTicker = 0;
  let zoomTransition: undefined | ReturnType<typeof createTransition<number>>;

  let moveTransitionTicker = 0;
  let moveTransition:
    | undefined
    | ReturnType<typeof createTransition<[number, number]>>;

  function differenceLatLon(
    ll0: { lat: number; lon: number },
    ll1: { lat: number; lon: number }
  ): { lat: number; lon: number } {
    return { lat: ll0.lat - ll1.lat, lon: ll0.lon - ll1.lon };
  }

  sk.preload = () => {
    refreshData();
    bgImage = sk.loadImage("/data/argyle-square.svg");
  };

  sk.setup = () => {
    console.log("🚀 - Setup initialized - P5 is running");

    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    sk.rectMode(sk.CENTER);
    sk.imageMode(sk.CENTER);
    sk.frameRate(30);
    // dataTimer = setInterval(() => {
    //   refreshData();
    // }, 1000 * 60);

    //   cV = 0.182;

    const data = sk.getItem(binDataKey) as
      | null
      | {
          id: string;
          data: BinSensorDataEntry & {x: number, y: number}[];
        }[];
    if (data) {

    centreX = data[highlightedBin].data[0].x * zoom;
    centreY = data[highlightedBin].data[0].y * zoom;

      // const boundingBox = data.reduce(
      //   (acc, d) => {
      //     const min = acc[0];
      //     const max = acc[1];
      //     const dLat = d.data[0].lat_long.lat;
      //     const dLon = d.data[0].lat_long.lon;
      //     if (
      //       max.lat === 0 &&
      //       max.lon === 0 &&
      //       min.lat === 0 &&
      //       min.lon === 0
      //     ) {
      //       return [
      //         {
      //           lat: dLat,
      //           lon: dLon,
      //         },
      //         {
      //           lat: dLat,
      //           lon: dLon,
      //         },
      //       ];
      //     } else {
      //       const newMinLat = dLat < min.lat ? dLat : min.lat;
      //       const newMinLon = dLon < min.lon ? dLon : min.lon;
      //       const newMaxLat = dLat > max.lat ? dLat : max.lat;
      //       const newMaxLon = dLon > max.lon ? dLon : max.lon;
      //       return [
      //         { lat: newMinLat, lon: newMinLon },
      //         { lat: newMaxLat, lon: newMaxLon },
      //       ];
      //     }
      //   },
      //   [
      //     { lat: 0, lon: 0 },
      //     { lat: 0, lon: 0 },
      //   ]
      // );
      // console.log(boundingBox);
    }
  };

  sk.draw = () => {
    zoomCycle();
    

    const startCenter = [centreX, centreY];

    if (bgImage) {
      sk.push();
      sk.translate(centreX, centreY);
      const imageZoomPC = 250000;
      sk.image(
        bgImage,
        0,
        0,
        (bgImage.width * zoom) / imageZoomPC,
        (bgImage.height * zoom) / imageZoomPC
      );
      sk.pop();
    }

    let c = sk.color(BACKGROUND);
    c.setAlpha(245);
    sk.fill(c);

    sk.rect(
      sk.windowWidth / 2,
      sk.windowHeight / 2,
      sk.windowWidth,
      sk.windowHeight
    );

    const data = sk.getItem(binDataKey) as
      | null
      | {
          id: string;
          data: (BinSensorDataEntry & {x: number, y: number})[];
        }[];

    // const text = sk.getItem(textKey) as string[];
    // if (text) {
    //   sk.push();
    //   sk.rectMode("corner");
    //   textY += sk.deltaTime / 100;
    //   if (textY > 1 * textHeight) {
    //     textY = 0;
    //     textPage += 1;
    //   }
    //   if (textPage >= text.length) {
    //     textPage = 0;
    //   }
    //   let c = sk.color(PISTACHIO);
    //   c.setAlpha(30);
    //   sk.fill(c);
    //   // sk.stroke(AMARANTH_PINK)
    //   sk.textFont("Courier New");
    //   sk.textSize(textHeight);

    //   const textRows = sk.ceil(sk.windowHeight / textHeight) + 4;

    //   text.slice(textPage, textPage + textRows).forEach((t, i) => {
    //     sk.text(
    //       t,
    //       0,
    //       textY + textRows * textHeight - (i + 3) * textHeight,
    //       sk.windowWidth,
    //       textHeight
    //     );
    //   });
    //   sk.pop();
    // }

    let tc = sk.color(PISTACHIO);
    tc.setAlpha(160);
    sk.fill(tc);
    // sk.stroke(AMARANTH_PINK)
    sk.textFont("Courier New");
    sk.textSize(textHeight);

    // need to add link, maybe can just use html?
    sk.text(
      "Map image from OpenStreetMap",
      sk.windowWidth - (300 - textHeight),
      sk.windowHeight - textHeight
    );

    const centrePoint = sk.getItem(centrePointKey) as null | {
      lat: number;
      lon: number;
    };

    sk.push();
    // console.log(centrePoint)
    if (data && centrePoint) {
      centreX = data[highlightedBin].data[0].x * zoom;
      centreY = data[highlightedBin].data[0].y * zoom;
      sk.translate(centreX, centreY);

      let done = true;
      // Complete 1 full rotation (2 PI rads) every 5 seconds
      rotationAngle += ((2 * sk.PI) / 5) * (sk.deltaTime / 1000);
      data.forEach((bin, i) => {
        // bins can have different amounts of data
        // we want to start at the beginning and step through each entry and default to the last entry if no more data is available

        let binData;
        if (entry < 0) {
          done = done && true;
          binData = bin.data[0];
        } else if (bin.data.length > entry) {
          done = done && false;
          binData = bin.data[entry];
        } else {
          binData = bin.data[bin.data.length - 1];
          done = done && true;
        }

        // change data entry every 300 millis
        if (done) {
          reverse = !reverse;
          entry += 1 * (reverse ? -1 : 1);
        } else if (entryCounter > 1000) {
          entry += 1 * (reverse ? -1 : 1);
          entryCounter = 0;
        } else {
          entryCounter += sk.deltaTime;
          // console.log(entryCounter)
        }

        // console.log("entry:", entry);

        const xx = binData.x * zoom;
        const yy = binData.y * zoom;
        // console.log(xx, yy)
        let systemSize = zoom / 30000;

        systemSize = systemSize > minSystemSize ? systemSize : minSystemSize;
        systemSize = systemSize < maxSystemSize ? systemSize : maxSystemSize;

        const fill_level = binData.filllevel
          ? sk.constrain(binData.filllevel, 0, 100)
          : 1;

        const planets = sk.ceil((fill_level / 100) * maxPlanets);

        // console.log(` sk.ceil( (${fill_level} / 100) * ${maxPlanets}) = ${planets}`)

        const temp = sk.norm(binData.temperature || 16, 0, 30);

        drawStarSystem(xx, yy, systemSize, i, planets || 1, temp);
      });
    }
    sk.pop();
  };

  // zoom when the user scrolls the mouse wheel.
  sk.mouseWheel = (event: WheelEvent) => {
    const zoomScrollAmount = 10000;

    if (event.deltaY > 0 && zoom < maxZoom) {
      zoom += zoomScrollAmount;
    } else if (zoom > minZoom && zoom - zoomScrollAmount > 0) {
      zoom -= zoomScrollAmount;
    }
    return false;
  };

  sk.mouseDragged = (event: MouseEvent) => {
    if (event.movementX && event.movementY) {
      const newCentreX = centreX + event.movementX;
      const newCentreY = centreY + event.movementY;

      if (newCentreX > 0 && newCentreX < sk.windowWidth) centreX = newCentreX;
      if (newCentreY > 0 && newCentreY < sk.windowHeight) centreY = newCentreY;
    }
    return false;
  };

  sk.touchStarted = () => {
    if (sk.touches.length === 1) {
      const touch = sk.touches[0] as { x: number; y: number };

      if ((touch.x, touch.y)) {
        touchDrag = [touch.x, touch.y];
      }
    }

    return false;
  };

  sk.touchMoved = (event: TouchEvent) => {
    if (sk.touches.length === 1) {
      const touch = sk.touches[0] as { x: number; y: number };

      if ((touch.x, touch.y)) {
        centreX += (touch.x - touchDrag[0]) / 20;
        centreY += (touch.y - touchDrag[1]) / 20;
      }
    }

    if (event.touches.length === 2) {
      const zoomScrollAmount = 10000;
      //@ts-ignore
      const scale: number = event.scale;

      if (scale && scale >= 1 && zoom < maxZoom) {
        zoom += zoomScrollAmount * scale;
      } else if (scale && zoom > minZoom && zoom - zoomScrollAmount > 0) {
        zoom -= zoomScrollAmount * scale;
      }
    }

    return false;
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
    let c = sk.color(BACKGROUND);
    c.setAlpha(160);
    sk.fill(c);
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

    let c;
    if (t > 0.75) {
      c = sk.color(CAROLINA_BLUE);
    } else if (t > 0.5) {
      c = sk.color(PARCHMENT);
    } else if (t > 0.25) {
      c = sk.color(CARROT_ORANGE);
    } else {
      c = sk.color(CHESTNUT);
    }

    sk.fill(c);

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
    // console.log(`drawStarSystem(x: ${x}, y: ${y}, s: ${s}, r: ${r}, p: ${p}, t: ${t})`)
    const orbits = Array.from(Array(p).keys()).map((i) => {
      const diameter = s * (2 + i) * 1.25;
      return {
        diameter,
        radius: diameter / 2,
        // rotation angle + small percentage variation based on planet + rotation offset of system + rotation offset based on planet
        angle:
          rotationAngle +
          r +
          ((rotationAngle + r) * (maxPlanets - i)) / maxPlanets / 2 +
          r +
          i * 2,
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
    let c = sk.color(FRENCH_MAUVE);
    c.setAlpha(100);
    sk.strokeWeight(2);
    sk.stroke(c);
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
      let c = sk.color(BACKGROUND);
      c.setAlpha(60);
      sk.fill(c);
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
    const lastRefresh = sk.getItem(refreshTimestampKey) as null | number;
    const data = sk.getItem(binDataKey);
    const centrePoint = sk.getItem(centrePointKey);
    // const text = sk.getItem(textKey);

    // console.log("data", data);

    // console.log("lastRefresh", lastRefresh);
    // console.log("Date.now() - refreshInterval", Date.now() - refreshInterval);
    // console.log(
    //   "lastRefresh < Date.now() - refreshInterval",
    //   lastRefresh < Date.now() - refreshInterval
    // );
    // console.log(centrePoint, data);
    if (
      data === null ||
      centrePoint === null ||
      // text === null ||
      lastRefresh < Date.now() - refreshInterval
    ) {
      getBinSensorDataForDate(date)
        .then((data) => {
          if (data) {
            const filteredData = data.filter(
              (d) => d.data[0].lat_long !== null
            );
            const { lat, lon } = filteredData.reduce(
              (acc, d) => {
                const dll = d.data[0].lat_long;
                return { lat: acc.lat + dll.lat, lon: acc.lon + dll.lon };
              },
              { lat: 0, lon: 0 }
            );


            const centre = {
              lat: lat / filteredData.length,
              lon: lon / filteredData.length,
            };

            // const text = data
            //   .flatMap((b) => b.data)
            //   .map((d) => JSON.stringify(d));

            const normalisedData = filteredData.map((b) => {
              const newData = b.data.map((d) => {
                  const { lon: x, lat: y } = differenceLatLon(
                    centre,
                    d.lat_long
                  );

                  return { x, y, ...d };
              });

              return {
                id: b.id,
                data: newData,
              };
            });

            normalisedData.forEach((d) => console.log(d.data[0].x,d.data[0].y ));

            // console.log("centrePoint", centre);

            // console.log(filteredData);

            sk.storeItem(centrePointKey, centre);
            sk.storeItem(binDataKey, normalisedData);
            sk.storeItem(refreshTimestampKey, Date.now());
            // sk.storeItem(textKey, text);
          }
        })
        .catch((e) => console.error("Could not refresh data: ", e));
    }
  }

  function createTransition<
    T
  >(name: string, ms: number, startValue: T, endValue: T, transition: (s: T, e: T, amount: number) => T) {
    const transitionStart = Date.now();
    console.log(name, "started: ", transitionStart);
    return () => {
      const now = Date.now();
      if (now > transitionStart + ms) {
        return endValue;
      } else {
        let amount = (now - transitionStart) / ms;
        if (amount < 0) {
          amount = 0;
        }
        if (amount > 1) {
          amount = 1;
        }
        return transition(startValue, endValue, amount);
      }
    };
  }

  function zoomCycle() {
    const zoomStep1 = startZoom;
    const zoomStep2 = startZoom * 2;
    if (zoom === zoomStep1 && zoomTransitionTicker === 0) {
      zoomTransition = createTransition(
        "Zoom In",
        2000,
        zoomStep1,
        zoomStep2,
        (start, end, amount) => {
          return start + (end - start) * amount;
        }
      );
    } else if (zoom === zoomStep2 && zoomTransitionTicker === 0) {
      zoomTransition = createTransition(
        "Zoom Out",
        2000,
        zoomStep2,
        zoomStep1,
        (start, end, amount) => {
          return start + (end - start) * amount;
        }
      );
    }

    if (zoomTransition) {
      zoom = zoomTransition();
    }

    zoomTransitionTicker += sk.deltaTime;

    if (zoomTransitionTicker > 1000 * 5) {
      zoomTransitionTicker = 0;
    }
  }
});
