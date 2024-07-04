var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var melbOpenDataBaseUrl = "https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/";
var binSensorDatasetId = "netvox-r718x-bin-sensor";
function melbDataUrl(datasetId) {
    return new URL("".concat(melbOpenDataBaseUrl).concat(datasetId, "/records"));
}
function isBinSensorData(data) {
    if (data instanceof Object && "total_count" in data && "results" in data) {
        if (data.results instanceof Array) {
            if (data.results.length > 0) {
                if ("dev_id" in data.results[0])
                    return true;
            }
            else {
                return true;
            }
        }
    }
    return false;
}
function isBinSensorDevIds(data) {
    if ("results" in data) {
        if (data.results.length > 0) {
            if ("dev_id" in data.results[0]) {
                return true;
            }
        }
        else {
            return true;
        }
    }
    return false;
}
function getBinSensorData(id, after_date) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, json, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = melbDataUrl(binSensorDatasetId);
                    url.search = new URLSearchParams({
                        where: "".concat(id ? "dev_id = \"".concat(id, "\"") : "").concat(id && after_date ? " and " : "").concat(after_date ? "time >= date'".concat(after_date.toISOString(), "'") : ""),
                        order_by: "time",
                        limit: "100",
                    }).toString();
                    return [4, fetch(url)];
                case 1:
                    response = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, response.json()];
                case 3:
                    json = _a.sent();
                    if (!isBinSensorData(json)) {
                        throw new Error("Unexpected response format: ".concat(json));
                    }
                    return [2, json.results];
                case 4:
                    e_1 = _a.sent();
                    if (e_1 instanceof Error) {
                        console.log("Request for ".concat(url, " failed:"), e_1.message);
                    }
                    console.log("Request for ".concat(url, " failed with weird error:"), e_1);
                    return [3, 5];
                case 5: return [2];
            }
        });
    });
}
function getBinSensorIds() {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, json, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = melbDataUrl(binSensorDatasetId);
                    url.search = new URLSearchParams({
                        group_by: "dev_id",
                        limit: "100",
                    }).toString();
                    return [4, fetch(url)];
                case 1:
                    response = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, response.json()];
                case 3:
                    json = _a.sent();
                    if (!isBinSensorDevIds(json)) {
                        throw new Error("Unexpected response format: ".concat(json));
                    }
                    return [2, json.results.map(function (o) { return o.dev_id; })];
                case 4:
                    e_2 = _a.sent();
                    if (e_2 instanceof Error) {
                        console.log("Request for ".concat(url, " failed:"), e_2.message);
                    }
                    console.log("Request for ".concat(url, " failed with weird error:"), e_2);
                    return [3, 5];
                case 5: return [2];
            }
        });
    });
}
function getBinSensorDataForDate(date) {
    return __awaiter(this, void 0, void 0, function () {
        var sensorIds, binData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getBinSensorIds()];
                case 1:
                    sensorIds = _a.sent();
                    return [4, Promise.all(sensorIds.map(function (id) { return getBinSensorData(id, date); }))];
                case 2:
                    binData = _a.sent();
                    return [2, sensorIds
                            .map(function (id, i) { return ({ id: id, data: binData[i] }); })
                            .filter(function (d) { return d.data.length > 0; })];
            }
        });
    });
}
var PARCHMENT = "#F3E9D2";
var PEACH = "#F7E3AF";
var CARROT_ORANGE = "#F18F01";
var CHESTNUT = "#C73E1D";
var AUTUMN_BROWN = "#541a0b";
var AMARANTH_PINK = "#E39EC1";
var FRENCH_MAUVE = "#C47AC0";
var CAROLINA_BLUE = "#84BCDA";
var PISTACHIO = "#B4DC7F";
var SPACE_CADET = "#2B2D42";
var LAVENDER_GREY = "#a3a6c9";
var BACKGROUND = SPACE_CADET;
var p5BinSketch = new p5(function sketch(sk) {
    var g = 9.8;
    var pixelsPerMetre = 3780;
    var fps = 30;
    var circleRadius = 5;
    var refreshInterval = 1000 * 60 * 15;
    var minSystemSize = 3;
    var maxSystemSize = sk.windowHeight * 0.1;
    var refreshTimestampKey = "sketch-data-refresh-timestamp";
    var binDataKey = "sketch-bin-data";
    var date = new Date();
    date.setDate(date.getDate() - 1);
    var dataTimer;
    var entry = 0;
    var centrePoint = { lat: 0, lon: 0 };
    var zoom = 500000;
    var rotationAngle = 0;
    var centreX = 0;
    var centreY = 0;
    function differenceLatLon(ll0, ll1) {
        return { lat: ll0.lat - ll1.lat, lon: ll0.lon - ll1.lon };
    }
    sk.setup = function () {
        console.log("🚀 - Setup initialized - P5 is running");
        sk.createCanvas(sk.windowWidth, sk.windowHeight);
        sk.rectMode(sk.CENTER);
        sk.frameRate(30);
        centreX = sk.windowWidth / 2;
        centreY = sk.windowHeight / 2;
        refreshData();
    };
    sk.draw = function () {
        sk.background(BACKGROUND);
        sk.push();
        sk.translate(centreX, centreY);
        var data = sk.getItem(binDataKey);
        if (data) {
            var done_1 = true;
            rotationAngle += ((2 * sk.PI) / 5) * (sk.deltaTime / 1000);
            data.forEach(function (bin, i) {
                var binData;
                if (bin.data.length > entry) {
                    done_1 = done_1 && false;
                    binData = bin.data[entry];
                }
                else {
                    binData = bin.data[bin.data.length - 1];
                    done_1 = done_1 && true;
                }
                if (done_1 && sk.millis() % 300 === 0) {
                    entry += 1;
                }
                else {
                    entry = 0;
                }
                if (binData.lat_long &&
                    "lon" in binData.lat_long &&
                    "lat" in binData.lat_long) {
                    var _a = differenceLatLon(centrePoint, binData.lat_long), x = _a.lon, y = _a.lat;
                    var xx = x * zoom;
                    var yy = y * zoom;
                    var systemSize = zoom / 25000;
                    systemSize = systemSize > minSystemSize ? systemSize : minSystemSize;
                    systemSize = systemSize < maxSystemSize ? systemSize : maxSystemSize;
                    drawStarSystem(xx, yy, systemSize, i);
                }
            });
        }
        sk.pop();
    };
    sk.mouseWheel = function (event) {
        var zoomScrollAmount = 10000;
        if (event.deltaY > 0) {
            zoom += zoomScrollAmount;
        }
        else {
            if (zoom - zoomScrollAmount > 0) {
                zoom -= zoomScrollAmount;
            }
        }
        return false;
    };
    sk.mouseDragged = function (event) {
        centreX += event.movementX;
        centreY += event.movementY;
    };
    function drawBottle(x, y, s, r) {
        if (r === void 0) { r = 0; }
        var w = s * 0.42;
        var h = s;
        sk.push();
        sk.rotate(r);
        sk.noStroke();
        sk.fill(CAROLINA_BLUE);
        var rX = 0;
        var rW = w;
        var cX = 0;
        var cD = w;
        var eX = 0;
        var eW = w;
        var eH = w / 2;
        var rY = 0;
        var rH = h - (cD / 2 + eH / 2);
        var cY = rY - rH / 2;
        var eY = rY + rH / 2;
        sk.circle(cX, cY, cD);
        sk.rect(rX, rY, rW, rH);
        sk.ellipse(eX, eY, eW, eH);
        var capW = w / 3;
        var capH = w / 3;
        sk.fill(PARCHMENT);
        sk.rect(0, cY - cD / 2, capW, capH, w / 10);
        sk.fill(FRENCH_MAUVE);
        var lH = rH / 2;
        var lrX = rY - lH / 3;
        sk.rect(0, lrX, rW, lH);
        sk.ellipse(0, lrX + lH / 2, eW, eH);
        sk.fill(CAROLINA_BLUE);
        sk.ellipse(0, lrX - lH / 2, eW, eH);
        sk.pop();
    }
    function drawAppleCore(x, y, s, r) {
        if (r === void 0) { r = 0; }
        var h = s * 0.6;
        var w = h / 2;
        sk.push();
        sk.translate(x, y);
        sk.rotate(r);
        sk.noStroke();
        var seH = w / 3;
        var rH = h - seH / 2;
        sk.fill(PISTACHIO);
        sk.rect(0, rH / 2, w, seH, s / 10);
        sk.fill(PEACH);
        sk.rect(0, 0, w, rH);
        sk.fill(BACKGROUND);
        sk.ellipse(-(w / 2), 0, w / 2, h);
        sk.ellipse(w / 2, 0, w / 2, h);
        sk.fill(PISTACHIO);
        sk.ellipse(0, -rH / 2, w, seH);
        sk.fill(AUTUMN_BROWN);
        var sH = s / 5;
        sk.push();
        sk.translate(0, -rH / 2 - sH / 2);
        sk.rotate(0.2);
        sk.rect(0, 0, sH / 3, sH);
        sk.pop();
        sk.push();
        sk.rotate(-0.2);
        sk.ellipse(w / 15, -w / 12, w / 6, w / 4);
        sk.pop();
        sk.pop();
    }
    function drawChipPacket(x, y, s, r) {
        if (r === void 0) { r = 0; }
        var h = s * 0.8;
        var w = h * 0.8;
        sk.push();
        sk.translate(x, y);
        sk.rotate(r);
        sk.noStroke();
        sk.fill(AMARANTH_PINK);
        var feH = s / 5;
        var rH = h - feH / 2;
        sk.rect(0, feH / 2, w, rH);
        sk.fill(LAVENDER_GREY);
        sk.rect(0, -(rH / 2) + feH / 2, w, feH, feH / 2);
        var bfrH = feH / 3;
        sk.rect(0, rH / 2 + feH / 2 - bfrH / 2, w, bfrH);
        sk.fill(FRENCH_MAUVE);
        sk.rect(0, 0 + feH / 2, w / 2, w / 3, s / 10);
        sk.pop();
    }
    function drawStar(x, y, d, t) {
        sk.push();
        sk.translate(x, y);
        sk.noStroke();
        if (t > 0.75) {
            sk.fill(CAROLINA_BLUE);
        }
        else if (t > 0.5) {
            sk.fill(PARCHMENT);
        }
        else if (t > 0.25) {
            sk.fill(CARROT_ORANGE);
        }
        else {
            sk.fill(CHESTNUT);
        }
        sk.circle(0, 0, d);
        sk.pop();
    }
    function drawStarSystem(x, y, s, r, p, t) {
        if (r === void 0) { r = 1; }
        if (p === void 0) { p = 3; }
        if (t === void 0) { t = 0; }
        var orbits = Array.from(Array(p).keys()).map(function (i) {
            var diameter = s * (2 + i) * 1.25;
            return {
                diameter: diameter,
                radius: diameter / 2,
                angle: rotationAngle + (rotationAngle * (3 - i)) / p / 2 + r + i * 2,
            };
        });
        var planetSize = s / 2;
        var blankSpaceSize = s * 0.75;
        sk.noStroke();
        sk.push();
        sk.translate(x, y);
        sk.push();
        sk.noFill();
        sk.stroke(FRENCH_MAUVE);
        orbits.forEach(function (_a) {
            var diameter = _a.diameter;
            sk.circle(0, 0, diameter);
        });
        sk.pop();
        orbits.forEach(function (_a) {
            var radius = _a.radius, angle = _a.angle;
            sk.push();
            sk.rotate(angle);
            sk.translate(radius, 0);
            sk.fill(SPACE_CADET);
            sk.circle(0, 0, blankSpaceSize);
            sk.pop();
        });
        orbits.forEach(function (_a, i) {
            var diameter = _a.diameter, radius = _a.radius, angle = _a.angle;
            sk.push();
            sk.rotate(angle);
            sk.translate(radius, 0);
            var planetAngle = angle + i + (rotationAngle * (3 - 1)) / 3;
            if (i === 0) {
                drawBottle(0, 0, planetSize, planetAngle);
            }
            else if (i % 2 === 0) {
                drawChipPacket(0, 0, planetSize, planetAngle);
            }
            else if (i === 1 || i % 3 === 0) {
                drawAppleCore(0, 0, planetSize, planetAngle);
            }
            else {
                drawBottle(0, 0, planetSize, planetAngle);
            }
            sk.pop();
        });
        drawStar(0, 0, s, t);
        sk.pop();
    }
    function refreshData() {
        getBinSensorDataForDate(date)
            .then(function (data) {
            if (data) {
                var filteredData = data.filter(function (d) { return d.data[0].lat_long !== null; });
                var _a = filteredData.reduce(function (acc, d) {
                    var dll = d.data[0].lat_long;
                    return { lat: acc.lat + dll.lat, lon: acc.lon + dll.lon };
                }, { lat: 0, lon: 0 }), lat = _a.lat, lon = _a.lon;
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
            .catch(function (e) { return console.error("Could not refresh data: ", e); });
    }
});
//# sourceMappingURL=build.js.map