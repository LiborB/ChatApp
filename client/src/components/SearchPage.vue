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
								v-model="topic"
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
									'card-selected': topicSelected == topic,
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
		};
	},
	methods: {
		init() {
			socket.on("foundSearch", (data: FoundSearch) => {
				Statics.CurrentCategory = this.topic;
				this.$router.push({
					name: "lobby",
					params: {
						otherUsername: data.otherUsername,
					},
				});
			});
			TopicService.getTopTenTopics().then((response) => {
				this.topTenTopics = response.data;
			});
		},

		beginSearching() {
			if (this.displayName.length > 0) {
				Statics.Username = this.displayName;
			}
			socket.emit("beginSearch", {
				username: Statics.Username,
				category: this.topic,
			});
			this.isSearching = true;
		},

		topicCardClick(topic: TopicStatistic) {
			this.topic = topic.topicName;
			//this.beginSearching();
			this.topicSelected = topic;
		},
	},
	mounted() {
		this.init();
	},
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
</style>
