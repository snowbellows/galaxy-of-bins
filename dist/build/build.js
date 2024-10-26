var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
function getBinSensorData(ids, after_date, before_date) {
    return __awaiter(this, void 0, void 0, function () {
        var limit_1, idString, where_1, response, json, total, first, numApiCalls, results, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    limit_1 = 100;
                    idString = ids && ids.map(function (id) { return "\"".concat(id, "\""); }).join(", ");
                    where_1 = "".concat(idString ? "dev_id in (".concat(idString, ")") : "").concat(idString && (after_date || before_date) ? " and " : "").concat(after_date ? "time >= date'".concat(after_date.toISOString(), "'") : "").concat(after_date && before_date ? " and " : "").concat(before_date ? "time <= date'".concat(before_date.toISOString(), "'") : "");
                    return [4, apiCall(binSensorDatasetId, {
                            where: where_1,
                            orderBy: "time",
                            limit: limit_1,
                            offset: 0,
                        })];
                case 1:
                    response = _a.sent();
                    return [4, response.json()];
                case 2:
                    json = _a.sent();
                    if (!isBinSensorData(json)) {
                        throw new Error("Unexpected response format: ".concat(JSON.stringify(json)));
                    }
                    total = json.total_count;
                    first = json.results;
                    numApiCalls = Math.floor(total / limit_1);
                    return [4, Promise.all(Array.from(new Array(numApiCalls).keys()).map(function (i) {
                            return apiCall(binSensorDatasetId, {
                                where: where_1,
                                orderBy: "time",
                                limit: limit_1,
                                offset: limit_1 * (i + 1),
                            }).then(function (r) {
                                return r.json().then(function (j) {
                                    if (!isBinSensorData(j)) {
                                        throw new Error("Unexpected response format: ".concat(j));
                                    }
                                    return j.results;
                                });
                            });
                        }))];
                case 3:
                    results = _a.sent();
                    return [2, __spreadArray([first], results, true).flat()];
                case 4:
                    e_1 = _a.sent();
                    if (e_1 instanceof Error) {
                        console.log("Request for getBinSensorData failed:", e_1.message);
                    }
                    console.log("Request for getBinSensorData failed with weird error:", e_1);
                    return [3, 5];
                case 5: return [2];
            }
        });
    });
}
function getBinSensorIds() {
    return __awaiter(this, void 0, void 0, function () {
        var response, json, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4, apiCall(binSensorDatasetId, {
                            groupBy: "dev_id",
                            limit: 100,
                        })];
                case 1:
                    response = _a.sent();
                    return [4, response.json()];
                case 2:
                    json = _a.sent();
                    if (!isBinSensorDevIds(json)) {
                        throw new Error("Unexpected response format: ".concat(JSON.stringify(json)));
                    }
                    return [2, json.results.map(function (o) { return o.dev_id; })];
                case 3:
                    e_2 = _a.sent();
                    if (e_2 instanceof Error) {
                        console.log("Request for getBinSensorIds failed:", e_2.message);
                    }
                    console.log("Request for getBinSensorIds failed with weird error:", e_2);
                    return [3, 4];
                case 4: return [2];
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
                    return [4, Promise.all(sensorIds.map(function (id) { return getBinSensorData([id], date); }))];
                case 2:
                    binData = _a.sent();
                    return [2, sensorIds
                            .map(function (id, i) { return ({ id: id, data: binData[i] }); })
                            .filter(function (d) { return d.data.length > 0; })];
            }
        });
    });
}
function getBinSensorDataBetweenDates(after_date, before_date) {
    return __awaiter(this, void 0, void 0, function () {
        var sensorIds, binData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getBinSensorIds()];
                case 1:
                    sensorIds = _a.sent();
                    return [4, Promise.all(sensorIds.map(function (id) { return getBinSensorData([id], after_date, before_date); }))];
                case 2:
                    binData = _a.sent();
                    return [2, sensorIds
                            .map(function (id, i) { return ({ id: id, data: binData[i] }); })
                            .filter(function (d) { return d.data.length > 0; })];
            }
        });
    });
}
function apiCall(datasetId, options) {
    var url = melbDataUrl(datasetId);
    var where = options.where, orderBy = options.orderBy, groupBy = options.groupBy, offset = options.offset, limit = options.limit;
    url.search = new URLSearchParams(__assign(__assign(__assign(__assign(__assign({}, (where ? { where: where } : {})), (orderBy ? { order_by: orderBy } : {})), (groupBy ? { group_by: groupBy } : {})), (limit ? { limit: limit.toString() } : {})), (offset ? { offset: offset.toString() } : {}))).toString();
    return fetch(url);
}
var MATRIX = "#A4545F";
var KOBI = "#E7A3B2";
var POLO_BLUE = "#92A3CE";
var ANTIQUE_BRASS = "#C39070";
var BRANDY = "#DAC688";
var ECRU_WHITE = "#F4F6E9";
var THUNDER = "#1F1B1D";
var TEXT = ECRU_WHITE;
var STAR_HOT = POLO_BLUE;
var STAR_WARM = ECRU_WHITE;
var STAR_COOL = BRANDY;
var STAR_COLD = MATRIX;
var APPLE_FLESH = ECRU_WHITE;
var APPLE_SKIN = MATRIX;
var APPLE_STALK = ANTIQUE_BRASS;
var BOTTLE_PLASTIC = POLO_BLUE;
var BOTTLE_CAP = ECRU_WHITE;
var BOTTLE_LABEL_BG = KOBI;
var CHIP_PACKET = KOBI;
var CHIP_FOIL = ECRU_WHITE;
var CHIP_LABEL = BRANDY;
var SYSTEM_RING = KOBI;
var BACKGROUND = THUNDER;
var p5BinSketch = new p5(function sketch(sk) {
    var refreshInterval = 1000 * 60 * 10;
    var maxPlanets = 4;
    var minSystemSize = 3;
    var maxSystemSize = sk.windowHeight * 0.1;
    var refreshTimestampKey = "sketch-data-refresh-timestamp";
    var binDataKey = "sketch-bin-data";
    var centrePointKey = "sketch-bin-centre-point";
    var textKey = "sketch-bin-text";
    var afterDate = new Date();
    afterDate.setFullYear(afterDate.getFullYear() - 1);
    afterDate.setDate(afterDate.getDate() - 14);
    var beforeDate = new Date();
    beforeDate.setFullYear(beforeDate.getFullYear() - 1);
    var dataTimer;
    var doneIds = [];
    var entry = 0;
    var entryCounter = 0;
    var startZoom = 1000000;
    var zoom = 1000000;
    var minZoom = 200000;
    var maxZoom = 2400000;
    var textY = 0;
    var textPage = 0;
    var textHeight = 16;
    var rotationAngle = 0;
    var centreX = 0;
    var centreY = 0;
    var reverse = false;
    var touchDrag = [0, 0];
    var bgImage;
    function differenceLatLon(ll0, ll1) {
        return { lat: ll0.lat - ll1.lat, lon: ll0.lon - ll1.lon };
    }
    sk.preload = function () {
        refreshData();
        bgImage = sk.loadImage("/data/argyle-square.svg");
    };
    sk.setup = function () {
        console.log("🚀 - Setup initialized - P5 is running");
        sk.createCanvas(sk.windowWidth, sk.windowHeight);
        sk.rectMode(sk.CENTER);
        sk.imageMode(sk.CENTER);
        sk.frameRate(30);
        centreX = sk.windowWidth / 2;
        centreY = sk.windowHeight / 2;
        var data = sk.getItem(binDataKey);
        if (data) {
            var boundingBox = data.reduce(function (acc, d) {
                var min = acc[0];
                var max = acc[1];
                var dLat = d.data[0].lat_long.lat;
                var dLon = d.data[0].lat_long.lon;
                if (max.lat === 0 &&
                    max.lon === 0 &&
                    min.lat === 0 &&
                    min.lon === 0) {
                    return [
                        {
                            lat: dLat,
                            lon: dLon,
                        },
                        {
                            lat: dLat,
                            lon: dLon,
                        },
                    ];
                }
                else {
                    var newMinLat = dLat < min.lat ? dLat : min.lat;
                    var newMinLon = dLon < min.lon ? dLon : min.lon;
                    var newMaxLat = dLat > max.lat ? dLat : max.lat;
                    var newMaxLon = dLon > max.lon ? dLon : max.lon;
                    return [
                        { lat: newMinLat, lon: newMinLon },
                        { lat: newMaxLat, lon: newMaxLon },
                    ];
                }
            }, [
                { lat: 0, lon: 0 },
                { lat: 0, lon: 0 },
            ]);
            console.log(boundingBox);
        }
    };
    sk.draw = function () {
        var c = sk.color(BACKGROUND);
        c.setAlpha(220);
        sk.fill(c);
        sk.rect(sk.windowWidth / 2, sk.windowHeight / 2, sk.windowWidth, sk.windowHeight);
        var data = sk.getItem(binDataKey);
        var tc = sk.color(TEXT);
        tc.setAlpha(160);
        sk.fill(tc);
        sk.textFont("Courier New");
        sk.textSize(textHeight);
        sk.text("Map image from OpenStreetMap", sk.windowWidth - (300 - textHeight), sk.windowHeight - textHeight);
        var centrePoint = sk.getItem(centrePointKey);
        sk.push();
        sk.translate(centreX, centreY);
        if (data && centrePoint) {
            var done_1 = true;
            rotationAngle += ((2 * sk.PI) / 5) * (sk.deltaTime / 1000);
            data.forEach(function (bin, i) {
                var binData;
                if (entry < 0) {
                    done_1 = done_1 && true;
                    binData = bin.data[0];
                }
                else if (bin.data.length > entry) {
                    done_1 = done_1 && false;
                    binData = bin.data[entry];
                }
                else {
                    if (!doneIds.includes(bin.id)) {
                        doneIds.push(bin.id);
                        console.log(bin.id, "done at", entry);
                    }
                    binData = bin.data[bin.data.length - 1];
                    done_1 = done_1 && true;
                }
                if (binData.lat_long &&
                    "lon" in binData.lat_long &&
                    "lat" in binData.lat_long) {
                    var _a = differenceLatLon(centrePoint, binData.lat_long), x = _a.lon, y = _a.lat;
                    var xx = x * zoom;
                    var yy = y * zoom;
                    var systemSize = zoom / 30000;
                    systemSize = systemSize > minSystemSize ? systemSize : minSystemSize;
                    systemSize = systemSize < maxSystemSize ? systemSize : maxSystemSize;
                    var fill_level = binData.filllevel
                        ? sk.constrain(binData.filllevel, 1, 100)
                        : 1;
                    var planets = sk.round((fill_level / 100) * maxPlanets);
                    var temp = sk.norm(binData.temperature || 16, 0, 30);
                    drawStarSystem(xx, yy, systemSize, i, planets || 1, temp);
                }
            });
            if (done_1) {
                console.log("done at ", entry);
                entry = 0;
            }
            else if (entryCounter > 100) {
                entry += 1;
                entryCounter = 0;
            }
            else {
                entryCounter += sk.deltaTime;
            }
        }
        sk.pop();
    };
    sk.mouseWheel = function (event) {
        var zoomScrollAmount = 10000;
        if (event.deltaY > 0 && zoom < maxZoom) {
            zoom += zoomScrollAmount;
        }
        else if (zoom > minZoom && zoom - zoomScrollAmount > 0) {
            zoom -= zoomScrollAmount;
        }
        return false;
    };
    sk.mouseDragged = function (event) {
        if (event.movementX && event.movementY) {
            var newCentreX = centreX + event.movementX;
            var newCentreY = centreY + event.movementY;
            centreX = newCentreX;
            centreY = newCentreY;
        }
        return false;
    };
    sk.touchStarted = function () {
        if (sk.touches.length === 1) {
            var touch = sk.touches[0];
            if ((touch.x, touch.y)) {
                touchDrag = [touch.x, touch.y];
            }
        }
        return false;
    };
    sk.touchMoved = function (event) {
        if (sk.touches.length === 1) {
            var touch = sk.touches[0];
            if ((touch.x, touch.y)) {
                centreX += (touch.x - touchDrag[0]) / 20;
                centreY += (touch.y - touchDrag[1]) / 20;
            }
        }
        if (event.touches.length === 2) {
            var zoomScrollAmount = 10000;
            var scale = event.scale;
            if (scale && scale >= 1 && zoom < maxZoom) {
                zoom += zoomScrollAmount * scale;
            }
            else if (scale && zoom > minZoom && zoom - zoomScrollAmount > 0) {
                zoom -= zoomScrollAmount * scale;
            }
        }
        return false;
    };
    function drawBottle(x, y, s, r) {
        if (r === void 0) { r = 0; }
        var w = s * 0.42;
        var h = s;
        sk.push();
        sk.rotate(r);
        sk.noStroke();
        sk.fill(BOTTLE_PLASTIC);
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
        sk.fill(BOTTLE_CAP);
        sk.rect(0, cY - cD / 2, capW, capH, w / 10);
        sk.fill(BOTTLE_LABEL_BG);
        var lH = rH / 2;
        var lrX = rY - lH / 3;
        sk.rect(0, lrX, rW, lH);
        sk.ellipse(0, lrX + lH / 2, eW, eH);
        sk.fill(BOTTLE_PLASTIC);
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
        sk.fill(APPLE_SKIN);
        sk.rect(0, rH / 2, w, seH, s / 10);
        sk.fill(APPLE_FLESH);
        sk.rect(0, 0, w, rH);
        var c = sk.color(BACKGROUND);
        c.setAlpha(160);
        sk.fill(c);
        sk.ellipse(-(w / 2), 0, w / 2, h);
        sk.ellipse(w / 2, 0, w / 2, h);
        sk.fill(APPLE_SKIN);
        sk.ellipse(0, -rH / 2, w, seH);
        sk.fill(APPLE_STALK);
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
        sk.fill(CHIP_PACKET);
        var feH = s / 5;
        var rH = h - feH / 2;
        sk.rect(0, feH / 2, w, rH);
        sk.fill(CHIP_FOIL);
        sk.rect(0, -(rH / 2) + feH / 2, w, feH, feH / 2);
        var bfrH = feH / 3;
        sk.rect(0, rH / 2 + feH / 2 - bfrH / 2, w, bfrH);
        sk.fill(CHIP_LABEL);
        sk.rect(0, 0 + feH / 2, w / 2, w / 3, s / 10);
        sk.pop();
    }
    function drawStar(x, y, d, t) {
        sk.push();
        sk.translate(x, y);
        sk.noStroke();
        var c;
        if (t > 0.75) {
            c = sk.color(STAR_HOT);
        }
        else if (t > 0.5) {
            c = sk.color(STAR_WARM);
        }
        else if (t > 0.25) {
            c = sk.color(STAR_COOL);
        }
        else {
            c = sk.color(STAR_COLD);
        }
        sk.fill(c);
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
                angle: rotationAngle +
                    r +
                    ((rotationAngle + r) * (maxPlanets - i)) / maxPlanets / 2 +
                    r +
                    i * 2,
            };
        });
        var planetSize = s / 2;
        var blankSpaceSize = s * 0.75;
        sk.noStroke();
        sk.push();
        sk.translate(x, y);
        sk.push();
        sk.noFill();
        var c = sk.color(SYSTEM_RING);
        c.setAlpha(100);
        sk.strokeWeight(2);
        sk.stroke(c);
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
            var c = sk.color(BACKGROUND);
            sk.fill(c);
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
        var lastRefresh = sk.getItem(refreshTimestampKey);
        var data = sk.getItem(binDataKey);
        var centrePoint = sk.getItem(centrePointKey);
        if (data === null ||
            centrePoint === null ||
            lastRefresh < Date.now() - refreshInterval) {
            getBinSensorDataForDate(afterDate)
                .then(function (data) {
                if (data) {
                    var filteredData = data.filter(function (d) { return d.data[0].lat_long !== null; });
                    var _a = filteredData.reduce(function (acc, d) {
                        var dll = d.data[0].lat_long;
                        return { lat: acc.lat + dll.lat, lon: acc.lon + dll.lon };
                    }, { lat: 0, lon: 0 }), lat = _a.lat, lon = _a.lon;
                    filteredData.forEach(function (d) { return console.log(d.data[0].lat_long); });
                    var centre = {
                        lat: lat / filteredData.length,
                        lon: lon / filteredData.length,
                    };
                    sk.storeItem(centrePointKey, centre);
                    sk.storeItem(binDataKey, filteredData);
                    sk.storeItem(refreshTimestampKey, Date.now());
                }
            })
                .catch(function (e) { return console.error("Could not refresh data: ", e); });
        }
    }
});
//# sourceMappingURL=build.js.map