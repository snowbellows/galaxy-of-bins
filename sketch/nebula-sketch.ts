// // Colours

import { BACKGROUND } from "./consts/colours";

export const genNebulaSketch = () =>
  new p5(function nSketch(sk: p5) {
    sk.draw = () => {
      sk.background(BACKGROUND);
    };
  });

// let nebulaSketch = new p5(function sketch(sk: p5) {
//   const refreshInterval = 1000 * 60 * 10; // 10m

//   const maxPlanets = 4;

//   const minSystemSize = 3;
//   const maxSystemSize = sk.windowHeight * 0.1;

//   const refreshTimestampKey = "sketch-data-refresh-timestamp";
//   const binDataKey = "sketch-bin-data";
//   const centrePointKey = "sketch-bin-centre-point";
//   const textKey = "sketch-bin-text";

//   const afterDate = new Date();

//   afterDate.setFullYear(afterDate.getFullYear() - 1);

//   afterDate.setDate(afterDate.getDate() - 14);

//   const beforeDate = new Date();

//   beforeDate.setFullYear(beforeDate.getFullYear() - 1);

//   let dataTimer;

//   let doneIds: string[] = [];

//   let entry = 0;
//   let entryCounter = 0;

//   let startZoom = 1000000;
//   let zoom = 1000000;
//   const minZoom = 200000;
//   const maxZoom = 2400000;

//   let textY = 0;
//   let textPage = 0;
//   const textHeight = 16;

//   let rotationAngle = 0;
//   let centreX = 0;
//   let centreY = 0;

//   let reverse = false;

//   let touchDrag = [0, 0];

//   let bgImage: undefined | p5.Image;

//   function differenceLatLon(
//     ll0: { lat: number; lon: number },
//     ll1: { lat: number; lon: number }
//   ): { lat: number; lon: number } {
//     return { lat: ll0.lat - ll1.lat, lon: ll0.lon - ll1.lon };
//   }

//   sk.preload = () => {
//   };

//   sk.setup = () => {
//     console.log("🚀 - Setup initialized - P5 is running");

//     sk.createCanvas(sk.windowWidth, sk.windowHeight);
//     sk.rectMode(sk.CENTER);
//     sk.imageMode(sk.CENTER);
//     sk.frameRate(30);

//     centreX = sk.windowWidth / 2;
//     centreY = sk.windowHeight / 2;
//     // dataTimer = setInterval(() => {
//     //   refreshData();
//     // }, 1000 * 60);

//     //   cV = 0.182;

//   };

//   sk.draw = () => {
//     let c = sk.color(THUNDER);
//     c.setAlpha(220);
//     sk.fill(c);

//     sk.rect(
//       sk.windowWidth / 2,
//       sk.windowHeight / 2,
//       sk.windowWidth,
//       sk.windowHeight
//     );

//     const data = sk.getItem(binDataKey) as
//       | null
//       | {
//           id: string;
//           data: BinSensorDataEntry[];
//         }[];

//     // const text = sk.getItem(textKey) as string[];
//     // if (text) {
//     //   sk.push();
//     //   sk.rectMode("corner");
//     //   textY += sk.deltaTime / 100;
//     //   if (textY > 1 * textHeight) {
//     //     textY = 0;
//     //     textPage += 1;
//     //   }
//     //   if (textPage >= text.length) {
//     //     textPage = 0;
//     //   }
//     //   let c = sk.color(PISTACHIO);
//     //   c.setAlpha(30);
//     //   sk.fill(c);
//     //   // sk.stroke(AMARANTH_PINK)
//     //   sk.textFont("Courier New");
//     //   sk.textSize(textHeight);

//     //   const textRows = sk.ceil(sk.windowHeight / textHeight) + 4;

//     //   text.slice(textPage, textPage + textRows).forEach((t, i) => {
//     //     sk.text(
//     //       t,
//     //       0,
//     //       textY + textRows * textHeight - (i + 3) * textHeight,
//     //       sk.windowWidth,
//     //       textHeight
//     //     );
//     //   });
//     //   sk.pop();
//     // }

//     const centrePoint = sk.getItem(centrePointKey) as null | {
//       lat: number;
//       lon: number;
//     };

//     sk.push();
//     sk.translate(centreX, centreY);
//     // console.log(centrePoint)
//     if (data && centrePoint) {
//       let done = true;
//       // Complete 1 full rotation (2 PI rads) every 5 seconds
//       rotationAngle += ((2 * sk.PI) / 5) * (sk.deltaTime / 1000);
//       data.forEach((bin, i) => {
//         // bins can have different amounts of data
//         // we want to start at the beginning and step through each entry and default to the last entry if no more data is available

//         let binData;
//         if (entry < 0) {
//           done = done && true;
//           binData = bin.data[0];
//         } else if (bin.data.length > entry) {
//           done = done && false;
//           binData = bin.data[entry];
//         } else {
//           if (!doneIds.includes(bin.id)) {
//             doneIds.push(bin.id);
//             console.log(bin.id, "done at", entry);
//           }
//           binData = bin.data[bin.data.length - 1];
//           done = done && true;
//         }

//         // console.log("entry:", entry);

//         if (
//           binData.lat_long &&
//           "lon" in binData.lat_long &&
//           "lat" in binData.lat_long
//         ) {
//           const { lon: x, lat: y } = differenceLatLon(
//             centrePoint,
//             binData.lat_long
//           );

//           const xx = x * zoom;
//           const yy = y * zoom;
//           // console.log(xx, yy)
//           let systemSize = zoom / 30000;

//           systemSize = systemSize > minSystemSize ? systemSize : minSystemSize;
//           systemSize = systemSize < maxSystemSize ? systemSize : maxSystemSize;

//           const fill_level = binData.filllevel
//             ? sk.constrain(binData.filllevel, 1, 100)
//             : 1;

//           const planets = sk.round((fill_level / 100) * maxPlanets);

//           // console.log(` sk.ceil( (${fill_level} / 100) * ${maxPlanets}) = ${planets}`)

//           const temp = sk.norm(binData.temperature || 16, 0, 30);

//           // drawStarSystem(xx, yy, systemSize, i, planets || 1, temp);

//           // let tc = sk.color(PISTACHIO);
//           // tc.setAlpha(160);
//           // sk.fill(tc);
//           // sk.textFont("Courier New");
//           // sk.textSize(textHeight * 0.8);
//           // sk.text(
//           //   binData.dev_id,
//           //   xx + systemSize + 50,
//           //   yy + systemSize + 50 - textHeight * 2
//           // );
//           // sk.text(
//           //   binData.sensor_name,
//           //   xx + systemSize + 50,
//           //   yy + systemSize + 50 - textHeight
//           // );

//           // sk.text(binData.time, xx + systemSize + 50, yy + systemSize + 50);
//           // sk.text(
//           //   `fill_level: ${binData.fill_level}`,
//           //   xx + systemSize + 50,
//           //   yy + systemSize + 50 + textHeight
//           // );
//           // sk.text(
//           //   `filllevel: ${binData.filllevel}`,
//           //   xx + systemSize + 50,
//           //   yy + systemSize + 50 + textHeight * 2
//           // );
//         }
//       });

//       // change data entry every 300 millis
//       if (done) {
//         // reverse = !reverse;
//         // entry += 1 * (reverse ? -1 : 1);
//         console.log("done at ", entry);
//         entry = 0;
//       } else if (entryCounter > 100) {
//         // entry += 1 * (reverse ? -1 : 1);
//         entry += 1;
//         entryCounter = 0;
//       } else {
//         entryCounter += sk.deltaTime;
//         // console.log(entryCounter)
//       }
//     }
//     sk.pop();
//   };

//   // zoom when the user scrolls the mouse wheel.
//   sk.mouseWheel = (event: WheelEvent) => {
//     const zoomScrollAmount = 10000;

//     if (event.deltaY > 0 && zoom < maxZoom) {
//       zoom += zoomScrollAmount;
//     } else if (zoom > minZoom && zoom - zoomScrollAmount > 0) {
//       zoom -= zoomScrollAmount;
//     }
//     return false;
//   };

//   sk.mouseDragged = (event: MouseEvent) => {
//     if (event.movementX && event.movementY) {
//       const newCentreX = centreX + event.movementX;
//       const newCentreY = centreY + event.movementY;

//       // if (newCentreX > 0 && newCentreX < sk.windowWidth) centreX = newCentreX;
//       // if (newCentreY > 0 && newCentreY < sk.windowHeight) centreY = newCentreY;
//       centreX = newCentreX;
//       centreY = newCentreY;
//     }
//     return false;
//   };

//   sk.touchStarted = () => {
//     if (sk.touches.length === 1) {
//       const touch = sk.touches[0] as { x: number; y: number };

//       if ((touch.x, touch.y)) {
//         touchDrag = [touch.x, touch.y];
//       }
//     }

//     return false;
//   };

//   sk.touchMoved = (event: TouchEvent) => {
//     if (sk.touches.length === 1) {
//       const touch = sk.touches[0] as { x: number; y: number };

//       if ((touch.x, touch.y)) {
//         centreX += (touch.x - touchDrag[0]) / 20;
//         centreY += (touch.y - touchDrag[1]) / 20;
//       }
//     }

//     if (event.touches.length === 2) {
//       const zoomScrollAmount = 10000;
//       //@ts-ignore
//       const scale: number = event.scale;

//       if (scale && scale >= 1 && zoom < maxZoom) {
//         zoom += zoomScrollAmount * scale;
//       } else if (scale && zoom > minZoom && zoom - zoomScrollAmount > 0) {
//         zoom -= zoomScrollAmount * scale;
//       }
//     }

//     return false;
//   };
// });
