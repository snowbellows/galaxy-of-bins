const melbOpenDataBaseUrl =
  "https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/";

const binSensorDatasetId = "netvox-r718x-bin-sensor";

function melbDataUrl(datasetId: string): URL {
  return new URL(`${melbOpenDataBaseUrl}${datasetId}/records`);
}

interface BinSensorDataType {
  total_count: number;
  results: {
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
  }[];
}

function isBinSensorData(data: any): data is BinSensorDataType {
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

async function getBinSensorData(): Promise<BinSensorDataType> {
  const url = melbDataUrl(binSensorDatasetId);

  url.search = new URLSearchParams({ limit: "100" }).toString();

  const response = await fetch(url);

  try {
    // if (!response.ok) {
    //   throw new Error(`Response status: ${response.status}`);
    // }

    const json = await response.json();
    if (!isBinSensorData(json)) {
      throw new Error(`Unexpected response format: ${json}`);
    }
    return json;
  } catch (e) {
    if (e instanceof Error) {
      console.log(`Request for ${url} failed:`, e.message);
    }

    console.log(`Request for ${url} failed with weird error:`, e);
  }
}
