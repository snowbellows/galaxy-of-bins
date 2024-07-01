const melbOpenDataBaseUrl =
  "https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/";

const binSensorDatasetId = "netvox-r718x-bin-sensor";

function melbDataUrl(datasetId: string): URL {
  return new URL(`${melbOpenDataBaseUrl}${datasetId}/records`);
}

interface BinSensorDataEntry {
  dev_id: string;
  time: string;
  temperature: number;
  distance: number;
  filllevel: number;
  battery: number;
  lat_long: {
    lon: number;
    lat: number;
  };
  sensor_name: string;
  fill_level: number;
}
interface BinSensorDataReturnType {
  total_count: number;
  results: BinSensorDataEntry[];
}

function isBinSensorData(data: any): data is BinSensorDataReturnType {
  if (data instanceof Object && "total_count" in data && "results" in data) {
    if (data.results instanceof Array) {
      if (data.results.length > 0) {
        if ("dev_id" in data.results[0]) return true;
      } else {
        return true;
      }
    }
  }

  return false;
}

interface BinSensorDevIdReturnType {
  results: {
    dev_id: string;
  }[];
}

function isBinSensorDevIds(data: any): data is BinSensorDevIdReturnType {
  if ("results" in data) {
    if (data.results.length > 0) {
      if ("dev_id" in data.results[0]) {
        return true;
      }
    } else {
      return true;
    }
  }
  return false;
}

async function getBinSensorData(
  id?: string,
  after_date?: Date
): Promise<BinSensorDataReturnType["results"]> {
  const url = melbDataUrl(binSensorDatasetId);

  url.search = new URLSearchParams({
    where: `${id ? `dev_id = "${id}"` : ""}${id && after_date ? " and " : ""}${
      after_date ? `time >= date'${after_date.toISOString()}'` : ""
    }`,
    limit: "100",
  }).toString();

  const response = await fetch(url);

  try {
    // if (!response.ok) {
    //   throw new Error(`Response status: ${response.status}`);
    // }

    const json = await response.json();
    if (!isBinSensorData(json)) {
      throw new Error(`Unexpected response format: ${json}`);
    }
    return json.results;
  } catch (e) {
    if (e instanceof Error) {
      console.log(`Request for ${url} failed:`, e.message);
    }

    console.log(`Request for ${url} failed with weird error:`, e);
  }
}

async function getBinSensorIds(): Promise<string[]> {
  const url = melbDataUrl(binSensorDatasetId);

  url.search = new URLSearchParams({
    group_by: "dev_id",
    limit: "100",
  }).toString();

  const response = await fetch(url);

  try {
    // if (!response.ok) {
    //   throw new Error(`Response status: ${response.status}`);
    // }

    const json = await response.json();
    if (!isBinSensorDevIds(json)) {
      throw new Error(`Unexpected response format: ${json}`);
    }

    return json.results.map((o) => o.dev_id);
  } catch (e) {
    if (e instanceof Error) {
      console.log(`Request for ${url} failed:`, e.message);
    }

    console.log(`Request for ${url} failed with weird error:`, e);
  }
}

async function getBinSensorDataForDate(date: Date): Promise<
  {
    id: string;
    data: BinSensorDataEntry[];
  }[]
> {
  const sensorIds = await getBinSensorIds();

  const binData = await Promise.all(
    sensorIds.map((id) => getBinSensorData(id, date))
  );

  return sensorIds
    .map((id, i) => ({ id, data: binData[i] }))
    .filter((d) => d.data.length > 0);
}
