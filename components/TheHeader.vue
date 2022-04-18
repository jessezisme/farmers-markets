<template>
    <header class="header">
        <nav class="g-container">
            <div class="header_in">
                <div class="header_home">
                    <a class="header_home-link g-link-1-inv" href="/" @click.prevent="clickLogo">
                        <img class="header_home-logo" src="~/assets/img/logo/logo.svg" alt="Find a Market" />
                        Find a Market
                    </a>
                </div>
                <div class="header_links">
                    <NuxtLink class="g-link-1-inv" to="/">search</NuxtLink>
                </div>
            </div>
        </nav>
    </header>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'IndexPage',

        methods: {
            clickLogo() {
                this.$nuxt.$route.path === '/' ? window.scrollTo(0, 0) : this.$router.push({ path: '/' });
            },
        },
    });
</script>

<style lang="scss" scoped>
    a {
        color: var(--th-link-inv);
    }
    .header {
        background: var(--th-brand-1-900);
        color: var(--th-text-inv);
    }
    .header_in {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        gap: 30px;
    }
    .header_home-logo {
        display: inline-block;
        height: 40px;
        width: 40px;
    }
    .header_home-link {
        display: flex;
        align-items: center;
        text-decoration: none;
    }

    @include media-breakpoint-up(md) {
        .header_in {
            padding: 15px 0;
        }
        .header_home-logo {
            width: 60px;
            height: 60px;
        }
    }
</style>
