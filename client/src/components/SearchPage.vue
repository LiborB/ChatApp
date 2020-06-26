<template>
    <a-row>
        <a-col :span="24">
            <a-row>
                <a-col :span="8"></a-col>
                <a-col :span="8">
                    <div class="choose-topic-header">
                        Find a topic!
                    </div>
                </a-col>
                <a-col :span="8"></a-col>
            </a-row>
            <a-row>
                <a-col :span="8"></a-col>
                <a-col :span="8">
                    <a-row class="search-row">
                        <a-col :span="24">
                            <a-auto-complete
                                v-model="topic"
                                style="width:100%"
                                size="large"
                                placeholder="Find Topic"
                                option-label-prop="title"
                                @search="handleTopicSearch"
                            >
                                <template slot="dataSource">
                                    <a-select-option
                                        v-for="(topic, index) in matchingTopics"
                                        :key="index.toString()"
                                        :title="topic.topicName"
                                    >
                                        <span>{{ topic.topicName }}</span
                                        >&nbsp;
                                        <span
                                            style="float:right; font-weight:bold"
                                            >{{ topic.count }} searches</span
                                        >
                                    </a-select-option>
                                </template>
                                <a-input>
                                    <a-button
                                        class="searchButton"
                                        icon="search"
                                        style="margin-right:-12px"
                                        slot="suffix"
                                        size="large"
                                        :type="
                                            isSearching ? 'danger' : 'primary'
                                        "
                                        @click="searchButtonClick"
                                    >
                                        {{ isSearching ? "Cancel" : "Search" }}
                                    </a-button>
                                </a-input>
                            </a-auto-complete>
                        </a-col>
                    </a-row>
                    <a-row class="loading-row">
                        <a-col :span="8" :offset="8">
                            <div v-if="isSearching">
                                <a-spin size="large"></a-spin>
                                <span class="searching-text"
                                    >Searching for user...</span
                                >
                            </div>
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
            <a-row class="top-ten-row">
                <a-col :span="8"></a-col>
                <a-col :span="8">
                    <a-row>
                        <a-col :span="24">
                            <div class="popular-topic-header">
                                Or choose a popular topic
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="[16, 16]">
                        <a-col
                            :span="6"
                            v-for="(topic, index) in topTenTopics"
                            :key="index"
                        >
                            <a-card
                                hoverable
                                :class="{
                                    'card-selected': topicSelected == topic
                                }"
                                @click="topicCardClick(topic)"
                                :title="topic.topicName"
                            >
                                <p>{{ topic.count }} searches</p>
                            </a-card>
                        </a-col>
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
import TopicService from "../services/topic-service";
import TopicStatistic from "../models/TopicStatistic";

interface FoundSearch {
    otherUsername: string;
}

export default Vue.extend({
    name: "search-page",
    data: () => {
        return {
            topic: "",
            isSearching: false,
            displayName: "",
            topTenTopics: [] as TopicStatistic[],
            topicSelected: new TopicStatistic(),
            matchingTopics: [] as TopicStatistic[]
        };
    },
    methods: {
        init() {
            socket.on("foundSearch", (data: FoundSearch) => {
                Statics.CurrentCategory = this.topic;
                this.$router.push({
                    name: "lobby",
                    params: {
                        otherUsername: data.otherUsername
                    }
                });
            });
            TopicService.getTopTenTopics().then(response => {
                this.topTenTopics = response.data;
            });
        },

        beginSearching() {
            if (this.topic.length === 0) {
                return;
            }

            if (this.displayName.length > 0) {
                Statics.Username = this.displayName;
            }
            socket.emit("beginSearch", {
                username: Statics.Username,
                category: this.topic
            });
            this.isSearching = true;
        },

        topicCardClick(topic: TopicStatistic) {
            this.topic = topic.topicName;
            //this.beginSearching();
            this.topicSelected = topic;
            this.cancelSearch();
        },

        cancelSearch() {
            console.log(1);
            socket.emit("cancelSearch");
            this.isSearching = false;
        },

        handleTopicSearch(value: string) {
            if (value.length === 0) {
                return;
            }
            TopicService.getMatchingTopics(value).then(response => {
                this.matchingTopics = response.data;
            });
        },
        searchButtonClick() {
            if (this.isSearching) {
                this.cancelSearch();
            } else {
                this.beginSearching();
            }
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

.choose-topic-header,
.popular-topic-header {
    font-size: 24px;
}

.top-ten-row {
    margin-top: 20px;
}

.card-selected {
    border-color: rgba(0, 0, 0, 0.09);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    background: #dadada;
}

.loading-row {
    margin-top: 20px;
}

.searching-text {
    font-size: 18px;
    margin-left: 10px;
}
</style>
