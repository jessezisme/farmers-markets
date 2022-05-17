<template>
    <footer class="footer">
        <div class="g-container">
            <p class="g-fs-sm">
                Thanks for stopping by. Check out the code for this site on
                <a href="https://github.com/jessezisme/farmers-markets" target="_blank" rel="noopener">GitHub</a>.
            </p>
        </div>
    </footer>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'TheFooter',
    });
</script>

<style lang="scss" scoped>
    .footer {
        padding: 2rem 0;
        background: var(--th-brand-1-100);
    }
</style>
