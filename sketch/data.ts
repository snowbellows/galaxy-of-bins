const baseUrl = import.meta.env.VITE_API_URL;

const binSensorDatasetId = 'netvox-r718x-bin-sensor';

function binDataUrl(): URL {
  return new URL(`${baseUrl}/melbourne-open-data/bin-data`);
}

export interface BinSensorDataEntry {
  devId: string;
  time: string;
  temperature: number;
  distance: number;
  battery: number;
  latLong: {
    lon: number;
    lat: number;
  };
  sensorName: string;
  fillLevel: number;
}
export interface BinSensorDataReturnType {
  totalCount: number;
  results: BinSensorDataEntry[];
}

function isBinSensorData(data: any): data is BinSensorDataReturnType {
  if (data instanceof Object && 'totalCount' in data && 'results' in data) {
    if (data.results instanceof Array) {
      if (data.results.length > 0) {
        if ('devId' in data.results[0]) return true;
      } else {
        return true;
      }
    }
  }

  return false;
}

interface BinSensorDevIdReturnType {
  results: {
    devId: string;
  }[];
}

function isBinSensorDevIds(data: any): data is BinSensorDevIdReturnType {
  if ('results' in data) {
    if (data.results.length > 0) {
      if ('devId' in data.results[0]) {
        return true;
      }
    } else {
      return true;
    }
  }
  return false;
}

async function getBinSensorData(
  ids?: string[],
  after_date?: Date,
  before_date?: Date

  // results: BinSensorDataReturnType["results"] = []
): Promise<BinSensorDataReturnType['results']> {
  try {
    // if (!response.ok) {
    //   throw new Error(`Response status: ${response.status}`);
    // }

    const limit = 100;

    const idString = ids && ids.map((id) => `"${id}"`).join(', ');

    const where = `${idString ? `dev_id in (${idString})` : ''}${
      idString && (after_date || before_date) ? ' and ' : ''
    }${after_date ? `time >= date'${after_date.toISOString()}'` : ''}${
      after_date && before_date ? ' and ' : ''
    }${before_date ? `time <= date'${before_date.toISOString()}'` : ''}`;

    const response = await apiCall({
      where,
      orderBy: 'time',
      limit,
      offset: 0,
    });

    const json = await response.json();
    if (!isBinSensorData(json)) {
      throw new Error(`Unexpected response format: ${JSON.stringify(json)}`);
    }

    const total = json.totalCount;

    let first = json.results;

    const numApiCalls = Math.floor(total / limit);

    const results = await Promise.all(
      Array.from(new Array(numApiCalls).keys()).map((i) => {
        return apiCall({
          where,
          orderBy: 'time',
          limit,
          offset: limit * (i + 1),
        }).then((r) => {
          return r.json().then((j) => {
            if (!isBinSensorData(j)) {
              throw new Error(`Unexpected response format: ${j}`);
            }
            return j.results;
          });
        });
      })
    );

    return [first, ...results].flat();
  } catch (e) {
    if (e instanceof Error) {
      console.log(`Request for getBinSensorData failed:`, e.message);
    } else {
      console.log(`Request for getBinSensorData failed with weird error:`, e);
    }
    throw e;
  }
}

async function getBinSensorIds(): Promise<string[]> {
  try {
    // if (!response.ok) {
    //   throw new Error(`Response status: ${response.status}`);
    // }

    const response = await apiCall({
      groupBy: 'dev_id',
      limit: 100,
    });

    const json = await response.json();
    if (!isBinSensorDevIds(json)) {
      throw new Error(`Unexpected response format: ${JSON.stringify(json)}`);
    }

    return json.results.map((o) => o.devId);
  } catch (e) {
    if (e instanceof Error) {
      console.log(`Request for getBinSensorIds failed:`, e.message);
    } else {
      console.log(`Request for getBinSensorIds failed with weird error:`, e);
    }
    throw e;
  }
}

export async function getBinSensorDataForDate(date: Date): Promise<
  {
    id: string;
    data: BinSensorDataEntry[];
  }[]
> {
  const sensorIds = await getBinSensorIds();

  const binData = await Promise.all(
    sensorIds.map((id) => getBinSensorData([id], date))
  );

  return sensorIds
    .map((id, i) => ({ id, data: binData[i] }))
    .filter((d) => d.data.length > 0);
}

export async function getBinSensorDataBetweenDates(
  after_date: Date,
  before_date: Date
): Promise<
  {
    id: string;
    data: BinSensorDataEntry[];
  }[]
> {
  const sensorIds = await getBinSensorIds();

  const binData = await Promise.all(
    sensorIds.map((id) => getBinSensorData([id], after_date, before_date))
  );

  return sensorIds
    .map((id, i) => ({ id, data: binData[i] }))
    .filter((d) => d.data.length > 0);
}

function apiCall(options: {
  where?: string;
  orderBy?: string;
  groupBy?: string;
  offset?: number;
  limit?: number;
}): Promise<Response> {
  const url = binDataUrl();
  const { where, orderBy, groupBy, offset, limit } = options;
  url.search = new URLSearchParams({
    ...(where ? { where } : {}),
    ...(orderBy ? { order_by: orderBy } : {}),
    ...(groupBy ? { group_by: groupBy } : {}),
    ...(limit ? { limit: limit.toString() } : {}),
    ...(offset ? { offset: offset.toString() } : {}),
  }).toString();

  return fetch(url);
}
