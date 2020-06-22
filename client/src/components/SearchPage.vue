<template>
    <a-row>
        <a-col :span="24">
            <a-row>
                <a-col :span="8"></a-col>
                <a-col :span="8">
                    <div class="choose-topic-header">
                        Choose a topic!
                    </div>
                </a-col>
                <a-col :span="8"></a-col>
            </a-row>
            <a-row>
                <a-col :span="8"></a-col>
                <a-col :span="8">
                    <a-row class="search-row">
                        <a-col :span="24">
                            <a-input-search
                                size="large"
                                @search="beginSearching"
                                enter-button
                                :loading="isSearching ? true : false"
                                v-model="category"
                                placeholder="Find Category"
                            ></a-input-search>
                        </a-col>
                    </a-row>
                    <a-row class="username-row">
                        <a-col :span="12">
                            <a-input
                                v-model="displayName"
                                placeholder="(Optional) Specify a display name"
                                ><a-icon slot="prefix" type="user"
                            /></a-input>
                        </a-col>
                        <a-col :span="6"></a-col>
                    </a-row>
                </a-col>
                <a-col :span="8"></a-col>
            </a-row>
        </a-col>
    </a-row>
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

<style scoped>
.search-row {
    margin-top: 10px;
}

.username-row {
    margin-top: 20px;
}

.choose-topic-header {
    font-size: 24px;
}
</style>
