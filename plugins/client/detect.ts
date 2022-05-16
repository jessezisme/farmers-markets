import Vue from 'vue';

declare module 'vue/types/vue' {
    interface Vue {
        $isGeoSupported(): boolean;
    }
}

Vue.prototype.$isGeoSupported = () => !!window?.navigator?.geolocation?.getCurrentPosition;
