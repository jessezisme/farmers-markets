<template>
    <section data-theme="dark" class="int">
        <div class="int_cont g-py-12 g-py-24--md">
            <div class="g-container">
                <div class="int_main g-p-4">
                    <h1 class="g-pb-8 g-fs-6xl--lg int_main-lead">Discover Local Farmers' Markets</h1>
                    <p class="g-fs-md g-fs-lg--lg g-pb-4 int_main-in">
                        This site pulls market data from the
                        <abbr title="U.S. Department of Agriculture">USDA's</abbr> Farmers Market Directory, which may not
                        include all offerings in your area - so check with your local organizations as well.
                    </p>
                    <p class="g-fs-md g-pb-4 int_main-in int_main-note">
                        <template v-if="isGeoSupported">
                            To get started, search by U.S. Zip Code or use your geolocation:
                        </template>
                        <template v-else> To get started, search by U.S. Zip Code: </template>
                    </p>
                    <form @submit.prevent novalidate>
                        <div class="int_zip">
                            <BaseInput
                                class="intro_zip-input"
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
                                @[BaseInputEvents.SearchSubmit]="searchSubmit"
                            />
                        </div>
                        <template v-if="isGeoSupported">
                            <!-- geolocation -->
                            <button @click="geoSubmit">get geolocation</button>
                            {{ geoMessage }}
                        </template>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { EmitEvents as BaseInputEvents } from '~/components/base/BaseInput.vue';

    interface GeoLocationParams {
        latitude: string;
        longitude: string;
    }

    export default Vue.extend({
        name: 'IndexPage',

        data() {
            return {
                // zip code field
                formZipCode: '',
                formShowStatus: false,
                BaseInputEvents,
                // geolocation
                geoLocation: null as GeoLocationParams | null,
                isGeoSupported: false,
                geoMessage: '',
            };
        },
        computed: {
            isFormZipCodeValid(): any {
                return /^[0-9]{5}$/gm.test(this.formZipCode);
            },
            formMessage(): String {
                if (!this.isFormZipCodeValid && this.formShowStatus) {
                    return 'Please enter a valid 5-digit U.S. Zip Code';
                }
                return '';
            },
        },
        mounted() {
            this.isGeoSupported = !!window?.navigator?.geolocation?.getCurrentPosition;
        },
        methods: {
            searchSubmit(): void {
                this.formShowStatus = true;

                if (this.isFormZipCodeValid) {
                    this.toSearchPage({ zip: this.formZipCode });
                }
            },
            geoSuccessCB(event: GeolocationPosition): void {
                if (event.coords.latitude && event.coords.longitude) {
                    this.geoLocation = {
                        latitude: '' + event.coords.latitude,
                        longitude: '' + event.coords.longitude.toString(),
                    };
                    this.toSearchPage(this.geoLocation);
                } else {
                    this.geoMessage = 'An error occured while determining geolocation. Please search by zip code instead.';
                }
            },
            geoErrorCB(): void {
                this.geoMessage = 'Geolocation must be enabled in your browser.';
            },
            async requestGeo() {
                await window.navigator.geolocation.getCurrentPosition(this.geoSuccessCB, this.geoErrorCB);
            },
            geoSubmit(): void {
                this.geoLocation = null;
                this.requestGeo();
            },
            toSearchPage(params: GeoLocationParams | { zip: string }) {
                this.$router.push({
                    path: '/search',
                    query: { ...params },
                });
            },
        },
    });
</script>

<style lang="scss" scoped>
    abbr {
        text-decoration: none;
    }
    .int {
        background-image: url('~assets/img/index/hero.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        color: var(--th-text);
    }
    .int_cont {
        background: rgba(0, 0, 0, 0.5);
    }
    .int_main {
        width: 60em;
        max-width: 100%;
        margin: auto;
        background: rgba(0, 0, 0, 0.8);
    }
    /* main heading */
    .int_main-lead {
        color: var(--th-brand-2-900);
    }
    .int_main-in {
        width: 40em;
        max-width: 100%;
    }
    .int_main-note {
        color: var(--th-brand-2-900);
    }
</style>
