import axios, { AxiosResponse, AxiosError, AxiosPromise, AxiosInstance } from 'axios';
import { SearchGeoQuery, SearchZipQuery } from '~/shared/ts';

/**
 * Location Detail Request:
 *
 * Search for farmers market results by location, either with zip or geolocation.
 * The results only contain basic information; detailed results for each market are handled in separate request
 *
 */
interface LocationResponseItemFromServer {
    id: string;
    marketname: string;
}
interface LocationResponseFromServer {
    results: Array<LocationResponseItemFromServer>;
}
export interface LocationResponseItem extends LocationResponseItemFromServer {}
export interface LocationResponseData {
    results: Array<LocationResponseItem>;
}
export type LocationRequest = Promise<AxiosResponse<LocationResponseData>>;

const requestLocationInstance = axios.create({
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
    },
    baseURL: 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/',
    method: 'get',
    responseType: 'json',
    timeout: 15000,
});

const requestLocationSuccess = (
    response: AxiosResponse<LocationResponseFromServer>
): AxiosResponse<LocationResponseData> => {
    const responseResults = response.data?.results;
    const hasNoResults = !responseResults[0] || responseResults[0]?.id.toLowerCase().trim().indexOf('error') === 0;
    const transformedResults = hasNoResults ? [] : [...response.data.results];

    return {
        ...response,
        data: {
            results: transformedResults,
        },
    };
};

requestLocationInstance.interceptors.response.use(requestLocationSuccess);

export const getLocationResultsByZip = (params: SearchZipQuery): LocationRequest => {
    const setParams = { zip: params.zip };

    return requestLocationInstance.request<LocationResponseData>({
        url: 'zipSearch',
        params: setParams,
    });
};

export const getLocationResultsByGeo = (params: SearchGeoQuery): LocationRequest => {
    const setParams = { lat: params.lat, lng: params.lng };

    return requestLocationInstance.request<LocationResponseData>({
        url: 'locSearch',
        params: setParams,
    });
};

/***
 *
 * Market Detail Request:
 * For requesting detailed information about one particular market, rather than results for location
 *
 */

interface MarketDetailItemFromServer {
    GoogleLink: string;
    Address: string;
    Schedule: string;
    Products: string;
}
interface MarketDetailResponseFromServer {
    marketdetails: MarketDetailItemFromServer;
}
interface MarketDetailGeoData {
    lat: string | null;
    lng: string | null;
}
export interface MarketDetailItem extends MarketDetailItemFromServer, MarketDetailGeoData {}
export interface MarketDetailResponse {
    marketdetails: MarketDetailItem | null;
}
type MarketDetailRequest = Promise<AxiosResponse<MarketDetailResponse>>;

const requestMarketDetailInstance = axios.create({
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
    },
    baseURL: 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail',
    method: 'get',
    responseType: 'json',
});

const getMarketDetailGeoData = (urlString: string): MarketDetailGeoData => {
    try {
        const getURL = new URL(urlString);
        const getQuery = getURL?.searchParams.get('q') || '';
        const getMatchArray = getQuery.match(/-?\d+\.\d+(?=,|\s)/g) || [];

        return {
            lat: getMatchArray[0] ? getMatchArray[0].trim() : null,
            lng: getMatchArray[1] ? getMatchArray[1].trim() : null,
        };
    } catch {
        return {
            lat: null,
            lng: null,
        };
    }
};

const removeHtmlFromSimpleObject = <T extends { [key: string]: any }>(obj: T): T => {
    const objCopy = { ...obj };

    (Object.keys(objCopy) as Array<keyof T>).forEach((objKey) => {
        if (objKey in objCopy && typeof objCopy[objKey] === 'string') {
            objCopy[objKey] = objCopy[objKey].replaceAll('<br>', '');
        }
        return objCopy;
    });

    return objCopy;
};

const getCleanMarketDetailData = (marketData: MarketDetailItem): MarketDetailItem => {
    const getData = { ...marketData };

    (Object.keys(getData) as Array<keyof MarketDetailItem>).forEach((dataKey) => {
        if (getData[dataKey] && typeof getData[dataKey] === 'string') {
            getData[dataKey] = (getData[dataKey] as string)
                .trim()
                .replaceAll(/<br>/g, '')
                .replaceAll(/\s+/g, ' ')
                .trim()
                .replaceAll(/;$/g, '');
        }
    });

    return getData;
};

const requestMarketDetailSuccess = (
    response: AxiosResponse<MarketDetailResponseFromServer>
): AxiosResponse<MarketDetailResponse> => {
    const responseDetails = response.data?.marketdetails || null;
    const hasNoResults =
        !responseDetails ||
        (responseDetails?.Schedule?.toLowerCase().indexOf('error') === 0 &&
            responseDetails?.Address?.toLowerCase().indexOf('error') === 0);
    let transformedMarketDetails: MarketDetailItem | null = null;

    if (responseDetails && !hasNoResults) {
        transformedMarketDetails = {
            ...getCleanMarketDetailData({
                ...responseDetails,
                ...getMarketDetailGeoData(response.data.marketdetails.GoogleLink),
            }),
        };
    }

    return {
        ...response,
        data: {
            marketdetails: transformedMarketDetails,
        },
    };
};

requestMarketDetailInstance.interceptors.response.use(requestMarketDetailSuccess);

export const getDetailedResult = (id: string): MarketDetailRequest => {
    const setParams = { id };

    return requestMarketDetailInstance.request<MarketDetailResponse>({
        params: setParams,
    });
};
