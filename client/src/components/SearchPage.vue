<template>
    <v-container>
        <v-row>
            <v-col cols="4"></v-col>
            <v-col cols="4">
                <div class="headline">
                    Choose a category and find your match!
                </div>
            </v-col>
            <v-col cols="4"></v-col>
        </v-row>
        <v-row>
            <v-col cols="4"></v-col>
            <v-col cols="4">
                <v-row align="center">
                    <v-col cols="9">
                        <v-text-field
                            :loading="isSearching ? true : false"
                            v-model="category"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-btn
                            @click="beginSearching"
                            color="primary"
                        >Search</v-btn>
                    </v-col>
                </v-row>

            </v-col>
            <v-col cols="4"></v-col>
        </v-row>
        <v-row>
            <v-col cols="4"></v-col>
            <v-col cols="4">
                <v-text-field
                    v-model="displayName"
                    placeholder="(Optional) Specify a display name"
                ></v-text-field>
            </v-col>
            <v-col cols="4"></v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { socket } from "../App.vue";
import Statics from "../shared/statics";

interface FoundSearch {
    otherUsername: string;
}

export default Vue.extend({
    name: "search-page",
    data: () => {
        return {
            category: "",
            isSearching: false,
            displayName: ""
        };
    },
    methods: {
        init() {
            socket.on("foundSearch", (data: FoundSearch) => {
                Statics.CurrentCategory = this.category;
                this.$router.push({
                    name: "lobby",
                    params: {
                        otherUsername: data.otherUsername
                    }
                });
            });
        },

        beginSearching(event: MouseEvent) {
            if (this.displayName.length > 0) {
                Statics.Username = this.displayName;
            }
            socket.emit("beginSearch", {
                username: Statics.Username,
                category: this.category
            });
            this.isSearching = true;
        }
    },
    mounted() {
        this.init();
    }
});
</script>
