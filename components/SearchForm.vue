<template>
    <form @submit.prevent novalidate>
        <div class="search">
            <BaseInput
                class="search_input"
                minlength="5"
                maxlength="5"
                inputmode="numeric"
                pattern="[0-9]*"
                v-model.trim="formZipCode"
                placeholder="Zip Code"
                :label="'5-Digit (U.S.) Zip Code'"
                :input-type="'search'"
                :show-status="formShowStatus"
                :is-valid="isFormZipCodeValid"
                :message="formMessage"
                :disabled="isDisabled"
                @[BaseInputEvents.SearchSubmit]="searchSubmit"
            />
        </div>
        <template v-if="$isGeoSupported()">
            <div class="search_geo">
                <button class="g-btn-1 g-mt-8 g-mb-4" :disabled="isDisabled" @click="geoSubmit">Use Current Location</button>
                <div role="alert" v-show="geoMessage">
                    {{ geoMessage }}
                </div>
            </div>
        </template>
    </form>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { SearchGeoQuery, SearchZipQuery } from '~/shared/ts';
    import { EmitEvents as BaseInputEvents } from '~/components/base/BaseInput.vue';

    export enum EmitEvents {
        SearchFormSubmit = 'search-form-submit',
    }

    interface GeoLocationData {
        latitude: string;
        longitude: string;
    }

    export default Vue.extend({
        name: 'SearchForm',

        props: {
            isDisabled: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                // emitted event enums from BaseInput
                BaseInputEvents,
                // zip code
                formZipCode: '',
                // whether to show input status and message
                formShowStatus: false,
                // geolocation
                geoLocation: null as GeoLocationData | null,
                // error message for geolocation
                geoMessage: '',
            };
        },
        computed: {
            // check zip code validity
            isFormZipCodeValid(): any {
                return /^[0-9]{5}$/gm.test(this.formZipCode);
            },
            // input form messaging
            formMessage(): String {
                if (!this.isFormZipCodeValid && this.formShowStatus) {
                    return 'Please enter a valid 5-digit U.S. Zip Code';
                }
                return '';
            },
        },
        methods: {
            searchSubmit(): void {
                this.formShowStatus = true;

                if (this.isFormZipCodeValid) {
                    this.toSearchPage({ zip: this.formZipCode });
                    this.formShowStatus = false;
                }
            },
            geoSuccessCB(event: GeolocationPosition): void {
                if (event.coords.latitude && event.coords.longitude) {
                    this.geoLocation = {
                        latitude: '' + event.coords.latitude.toString(),
                        longitude: '' + event.coords.longitude.toString(),
                    };
                    this.toSearchPage({ lat: this.geoLocation.latitude, lng: this.geoLocation.longitude });
                } else {
                    this.geoMessage =
                        'Location access An error occured while determining geolocation. Please search by zip code instead.';
                }
            },
            geoErrorCB(): void {
                this.geoMessage = 'To use this feature, location access for this site must be enabled in your browser.';
            },
            requestGeo() {
                window.navigator.geolocation.getCurrentPosition(this.geoSuccessCB, this.geoErrorCB);
            },
            geoSubmit(): void {
                if (!this.isDisabled) {
                    this.geoLocation = null;
                    this.requestGeo();
                }
            },
            toSearchPage(queryData: SearchGeoQuery | SearchZipQuery) {
                this.$router.push({
                    path: '/search',
                    query: { ...queryData },
                });
            },
        },
    });
</script>

<style lang="scss" scoped>
    ::v-deep input {
        flex-grow: 0;
        width: 15em;
        max-width: 100%;
    }
</style>
