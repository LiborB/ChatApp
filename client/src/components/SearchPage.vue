<template>
	<v-container>
		<v-text-field></v-text-field>
	</v-container>
</template>

<script lang="ts">
import Vue from "vue";
import io from "socket.io-client";
const socket = io("http://localhost:3000");

export default Vue.extend({
	name: "search-page",
	data: () => {
		return {
			category: "",
		};
	},
	methods: {
		init() {
			socket.on("foundSearch", (data: any) => {
				this.$router.push("lobby");
			});
		},
		beginSearching() {
			socket.emit("beginSearch", {
				clientId: socket.id,
				category: this.category,
			});
		},
	},
	mounted() {},
});
</script>
