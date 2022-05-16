<template>
    <section class="g-pb-24 page-search">
        <div class="intro">
            <div class="g-container">
                <h1 class="intro_heading">Search Local Farmers' Markets</h1>
                <p class="g-fs-md intro_text">
                    This site pulls market data from the
                    <abbr title="U.S. Department of Agriculture">USDA's</abbr> Farmers Market Directory, which may not
                    include all offerings in your area - so check with your local organizations as well.
                </p>
            </div>
        </div>

        <!-- form -->
        <div class="form">
            <div class="g-container">
                <p v-if="$isGeoSupported()" class="g-pb-4">
                    Search by U.S. Zip Code or allow browser access to search by your current location. This site will never
                    store or share your location data in any way.
                </p>
                <p v-else class="g-pb-4">Search by U.S. Zip Code:</p>
                <SearchForm :is-disabled="isLoading" />
            </div>
        </div>

        <!-- loading -->
        <template v-if="isLoading">
            <div class="search-loading">
                <BaseLoader />
            </div>
        </template>
        <template v-else>
            <div class="g-container">
                <!-- results summary -->
                <template v-if="showResultsText">
                    <template v-if="marketDetailResults && marketDetailResults.length">
                        <h2 class="summary g-fs-6">
                            <span class="summary_chip">{{ marketDetailResults.length }}</span> Results Found:
                            <span v-if="locationRequestType === 'zip'" class="summary_chip">
                                zip: {{ searchQueryZip.zip }}</span
                            >
                            <span v-else class="summary_chip"> {{ searchQueryGeo.lat }}, {{ searchQueryGeo.lng }} </span>
                        </h2>
                    </template>
                    <template v-else>
                        <h2 class="summary g-fs-6">No Results Found</h2>
                    </template>
                </template>

                <!-- errors -->
                <template v-if="errorMessage || (marketDetailResultErrors && marketDetailResultErrors.length)">
                    <div class="errors_item" v-if="errorMessage">{{ errorMessage }}</div>
                    <div class="errors_item" v-if="marketDetailResultErrors && marketDetailResultErrors.length">
                        {{ marketDetailResultErrors.length }} farmers' markets failed to load.
                    </div>
                </template>

                <!-- results list -->
                <template v-if="marketDetailResults && marketDetailResults.length">
                    <div class="detail-results">
                        <article class="detail" v-for="market in marketDetailResults" :key="market.marketname">
                            <h3 class="g-m-0 g-pb-8 detail_name" tabindex="0">{{ market.marketname }}</h3>
                            <div class="detail_info">
                                <div class="g-pb-4 detail_info-item">
                                    <dt>Google Maps Link</dt>
                                    <dd>
                                        <a
                                            class="detail_map-link"
                                            target="_blank"
                                            rel="noopener"
                                            :href="market.GoogleLink"
                                            >{{ market.GoogleLink }}</a
                                        >
                                    </dd>
                                </div>
                                <div class="g-pb-4 detail_info-item">
                                    <dt>Address</dt>
                                    <dd>{{ market.Address || 'N/A' }}</dd>
                                </div>
                                <div class="g-pb-4 detail_info-item">
                                    <dt>Schedule</dt>
                                    <dd>{{ market.Schedule || 'N/A' }}</dd>
                                </div>
                                <div class="detail_info-item">
                                    <dt>Products</dt>
                                    <dd>{{ market.Products || 'N/A' }}</dd>
                                </div>
                            </div>
                        </article>
                    </div>
                </template>
            </div>
        </template>
    </section>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { EmitEvents as BaseInputEvents } from '~/components/base/BaseInput.vue';
    import { SearchZipQuery, SearchGeoQuery } from '~/shared/ts';
    import {
        getLocationResultsByZip,
        getLocationResultsByGeo,
        getDetailedResult,
        LocationRequest,
        LocationResponseData,
        LocationResponseItem,
        MarketDetailItem,
    } from '~/shared/api/usda';

    enum SearchLocationRequestType {
        Zip = 'zip',
        Geo = 'geo',
    }
    type SearchMarketDetailError = {
        name: string;
        error: any;
    };
    interface SearchMarketDetailItem extends MarketDetailItem, LocationResponseItem {}

    export default Vue.extend({
        name: 'SearchPage',

        data() {
            return {
                searchQueryZip: null as SearchZipQuery | null,
                searchQueryGeo: null as SearchGeoQuery | null,
                locationRequestType: null as SearchLocationRequestType | null,
                locationResults: null as LocationResponseItem[] | null,
                marketDetailResults: null as SearchMarketDetailItem[] | null,
                marketDetailResultErrors: null as SearchMarketDetailError[] | null,
                errorMessage: null as string | null,
                isLoading: false,
                BaseInputEvents,
                SearchLocationRequestType,
            };
        },
        head() {
            return {
                title: 'Farmers Markets | Search',
                meta: [
                    {
                        hid: 'hid-search-desc',
                        name: 'description',
                        content: 'Search for Local Farmers Markets in Your Area',
                    },
                ],
            };
        },
        computed: {
            showResultsText(): boolean {
                return !!this.locationRequestType && !this.isLoading;
            },
        },
        watch: {
            '$route.query': {
                handler(newQuery: any) {
                    this.runSearchHandler(newQuery || {});
                },
                deep: true,
                immediate: true,
            },
        },
        methods: {
            runSearchHandler(queryData: any): void {
                this.resetForNewRequest();
                this.setQueryData(queryData || {});
                this.initLocationRequest(this.searchQueryZip, this.searchQueryGeo);
            },
            setLoadingState(loadingValue: boolean): void {
                this.isLoading = loadingValue;
            },
            resetForNewRequest(): void {
                this.locationRequestType = null;
                this.locationResults = null;
                this.marketDetailResults = null;
                this.marketDetailResultErrors = null;
            },
            getSearchZipQuery(queryData: any): SearchZipQuery | null {
                const isValid = /^\d{5}$/.test(queryData?.zip || '');
                return isValid ? { zip: queryData.zip } : null;
            },
            getSearchGeoQuery(queryData: any): SearchGeoQuery | null {
                const isValidLat = queryData?.lat && !isNaN(queryData.lat);
                const isValidLng = queryData?.lng && !isNaN(queryData.lng);
                return isValidLat && isValidLng ? { lat: queryData.lat, lng: queryData.lng } : null;
            },
            setQueryData(queryData: any): void {
                this.searchQueryZip = this.getSearchZipQuery(queryData);
                this.searchQueryGeo = this.getSearchGeoQuery(queryData);
            },
            getLocationRequestByZip(params: SearchZipQuery): LocationRequest {
                return getLocationResultsByZip(params);
            },
            getLocationRequestByGeo(params: SearchGeoQuery): LocationRequest {
                return getLocationResultsByGeo(params);
            },
            locationRequestSuccess(responseData: LocationResponseData): void {
                const locationResults = responseData?.results?.length ? [...responseData.results] : null;
                this.locationResults = locationResults;

                if (locationResults) {
                    this.initMarketDetailsRequests(locationResults);
                } else {
                    this.setLoadingState(false);
                }
            },
            locationRequestError(): void {
                this.setLoadingState(false);
                this.errorMessage = 'An error occurred while requesting farmers market data. Please try again.';
                this.locationResults = null;
                this.marketDetailResults = null;
            },
            processLocationRequest(locationRequest: LocationRequest): void {
                locationRequest
                    .then((response) => this.locationRequestSuccess(response.data))
                    .catch(() => this.locationRequestError());
            },
            initLocationRequest(queryZip: SearchZipQuery | null, queryGeo: SearchGeoQuery | null): void {
                if (queryZip) {
                    this.isLoading = true;
                    this.locationRequestType = SearchLocationRequestType.Zip;
                    this.processLocationRequest(this.getLocationRequestByZip(queryZip));
                } else if (queryGeo) {
                    this.isLoading = true;
                    this.locationRequestType = SearchLocationRequestType.Geo;
                    this.processLocationRequest(this.getLocationRequestByGeo(queryGeo));
                }
            },
            getMarketDetailsRequestById(id: string) {
                return getDetailedResult(id);
            },
            initMarketDetailsRequests(locationResults: LocationResponseItem[]) {
                const successArray: SearchMarketDetailItem[] = [];
                const errorsArray: SearchMarketDetailError[] = [];

                if (locationResults?.length) {
                    const requests = locationResults.map((marketLocationItem) => {
                        return this.getMarketDetailsRequestById(marketLocationItem.id)
                            .then((response) => {
                                if (response.data.marketdetails) {
                                    successArray.push({ ...marketLocationItem, ...response.data.marketdetails });
                                } else {
                                    errorsArray.push({
                                        name: marketLocationItem.marketname,
                                        error: null,
                                    });
                                }
                                return response.data;
                            })
                            .catch((error) => {
                                errorsArray.push({
                                    name: marketLocationItem.marketname,
                                    error,
                                });
                                return error;
                            });
                    });

                    Promise.allSettled(requests).then((values) => {
                        this.marketDetailResults = successArray.length ? [...successArray] : null;
                        this.marketDetailResultErrors = errorsArray.length ? [...errorsArray] : null;
                        this.setLoadingState(false);
                    });
                } else {
                    this.setLoadingState(false);
                }
            },
        },
    });
</script>

<style lang="scss" scoped>
    /*=============================================
    =            loading spinner            =
    =============================================*/
    .search-loading {
        min-height: 400px;
        position: relative;
        display: flex;
        justify-content: center;
        margin: 4rem 0;
    }

    /*=====  End of loading spinner  ======*/

    /*=============================================
    =            intro            =
    =============================================*/
    .intro {
        background: var(--th-std-grey-800);
        color: var(--th-text-inv);
        padding: 2rem 0;
    }

    .intro_text {
        width: 45em;
        max-width: 100%;
    }
    .form {
        background: var(--th-std-grey-100);
        padding: 1rem;
    }
    .form p {
        max-width: 45em;
        font-weight: bold;
    }

    /*=====  End of intro  ======*/

    /*=============================================
    =            result summary text           =
    =============================================*/
    .summary {
        display: flex;
        align-items: center;
        margin: 4rem 0;
    }
    .summary_chip {
        padding: 4px 8px;
        font-size: 0.95rem;
        font-weight: normal;
        background: var(--th-std-grey-700);
        color: var(--th-text-inv);
        margin: 0 5px;
        border-radius: 4px;

        &:first-child {
            margin-left: 0;
        }
    }
    /*=====  End of result summary text   ======*/

    /*=============================================
    =            result item        =
    =============================================*/
    .detail-results {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 15px;
    }
    .detail {
        padding: 15px;
        background: var(--th-std-grey-100);
    }
    .detail a {
        overflow-wrap: break-word;
    }
    .detail dt,
    .detail dd {
        margin: 0;
        padding: 0;
    }
    .detail dt {
        font-weight: bold;
    }
    .detail_name {
        color: var(--th-brand-1-800);
    }

    @include media-breakpoint-up(lg) {
        .detail-results {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 30px;
        }
        .detail {
            padding: 30px;
        }
    }
    /*=====  End of result item   ======*/
</style>
