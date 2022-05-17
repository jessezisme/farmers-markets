<template>
    <div class="app-page">
        <TheHeader class="app-header" />
        <main class="app-main g-container-main">
            <Nuxt />
        </main>
        <TheFooter class="app-footer" />
    </div>
</template>

<script>
    export default {
        name: 'DefaultLayout',
    };
</script>

<style lang="scss">
    .app-page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    .app-main {
        flex-grow: 1;
    }
</style>
