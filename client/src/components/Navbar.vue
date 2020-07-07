<template>
    <a-layout-header class="header">
        <span class="logo-title">ChatApp</span>
    </a-layout-header>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    name: "navbar"
});
</script>

<style scoped>
.header {
    background: white;
}

.logo-title {
    font-size: 26px;
}
</style>
