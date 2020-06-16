<template>
    <v-app>
        <navbar></navbar>

        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "@/components/Navbar.vue";
import io from "socket.io-client";
export const socket = io("http://192.168.1.101:3000");

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
</style>
