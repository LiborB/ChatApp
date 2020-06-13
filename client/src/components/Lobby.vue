<template>
    <v-container>
        <v-row>
            <v-col cols="3">
                <router-link to="/">Back</router-link>
            </v-col>
            <v-col cols="6">
                <v-row class="headline"><span>You are talking with
                        <span class="other-username-title">{{
                            otherUsername
                        }}</span>
                        about
                        <span class="category-title">{{ category }}
                        </span></span>
                </v-row>
                <v-row class="text-container">
                    <v-col cols="12">
                        <v-row
                            v-for="(message, index) in messages"
                            :key="index"
                        >
                            <v-col cols="12">
                                <span class="message-username">{{ message.username }}</span>&nbsp;
                                <span :class="{
                                    'local-message':
                                        message.username === username,
                                    'remote-message':
                                        message.username !== username
                                }">{{ message.text }}</span>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="currentMessageInput"
                            @keydown="sendMessage"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="3"></v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import User from "@/models/User";
import { socket } from "../App.vue";
import Statics from "../shared/statics";

interface Message {
    username: string;
    text: string;
}
export default Vue.extend({
    name: "lobby",
    props: {
        otherUsername: {
            type: String
        }
    },
    data() {
        return {
            messages: new Array<Message>(),
            currentMessageInput: "",
            username: Statics.Username,
            category: Statics.CurrentCategory
        };
    },
    mounted() {
        console.log(this.otherUsername);
        socket.on("messageReceived", (data: any) => {
            this.messages.push(data);
        });
    },

    methods: {
        sendMessage(event: KeyboardEvent) {
            if (event.keyCode === 13) {
                socket.emit("messageSent", {
                    text: this.currentMessageInput,
                    username: Statics.Username
                });
                this.currentMessageInput = "";
            }
        },
        preventNav(e: any) {
            e.preventDefault();
            e.returnValue = "";
        }
    },
    beforeMount() {
        window.addEventListener("beforeunload", this.preventNav);
    },

    beforeDestroy() {
        // Don't forget to clean up event listeners
        window.removeEventListener("beforeunload", this.preventNav);
    }
});
</script>

<style scoped>
.text-container {
    border: 1px solid black;
    height: 600px;
    overflow: auto;
}
.other-username-title {
    font-weight: bold;
    display: inline-block;
}

.category-title {
    font-weight: bold;
    display: inline-block;
}

.message-username {
    font-style: italic;
    font-size: 12px;
    font-weight: bold;
}
</style>
