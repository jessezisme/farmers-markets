<template>
    <section data-theme="dark" class="int">
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
        name: 'SearchPage',

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
    });
</script>

<style lang="scss" scoped></style>
