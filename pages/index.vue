<template>
    <section data-theme="dark" class="page-index int">
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
                        <template v-if="$isGeoSupported()">
                            Search by U.S. Zip Code or allow browser access to search by your current location. This site
                            will never store or share your location data in any way.
                        </template>
                        <template v-else> Search by U.S. Zip Code: </template>
                    </p>
                    <SearchForm />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'IndexPage',
        head() {
            return {
                title: 'Farmers Markets',
                meta: [
                    {
                        hid: 'hid-index-desc',
                        name: 'description',
                        content: 'Discover Local Farmers Markets in Your Area',
                    },
                ],
            };
        },
    });
</script>

<style lang="scss">
    .app-main {
        display: flex;
        flex-direction: column;
    }
</style>

<style lang="scss" scoped>
    abbr {
        text-decoration: none;
    }
    .page-index {
        color: var(--th-text);
    }
    .page-index,
    .int {
        display: flex;
        flex-direction: column;
    }
    .page-index,
    .int,
    .int_cont {
        flex-grow: 1;
    }
    .int {
        background-image: url('~assets/img/index/hero.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }
    .int_cont {
        // flex-grow: 1;
        background: rgba(0, 0, 0, 0.5);
    }
    .int_main {
        width: 60em;
        max-width: 100%;
        margin: auto;
        background: var(--th-brand-1-50);
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
    /* alert */
    [role='alert'] {
        color: var(--th-alert-text);
    }
</style>
