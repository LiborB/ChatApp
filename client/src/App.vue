<template>
    <a-layout class="layout-container">
        <navbar></navbar>
        <a-layout-content class="layout-content">
            <router-view></router-view>
        </a-layout-content>
    </a-layout>
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "@/components/Navbar.vue";
import io from "socket.io-client";
export const socket = io("http://localhost:3000");

export default Vue.extend({
    name: "App",

    components: {
        Navbar
    }
});
</script>

<style>
.hidden {
    visibility: hidden;
}

.html,
.body {
    height: 100%;
}

.layout-container {
    height: inherit;
}
</style>
