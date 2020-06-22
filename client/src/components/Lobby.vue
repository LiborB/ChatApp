<template>
    <a-row>
        <a-col :span="24">
            <a-row>
                <a-col>
                    <a-page-header
                        style="border: 1px solid rgb(235, 237, 240)"
                        :title="category"
                        :sub-title="`with ${otherUsername}`"
                        @back="goBack()"
                    ></a-page-header>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="6"> </a-col>
                <a-col :span="12">
                    <a-row class="info-title"
                        ><span
                            >You are talking with
                            <span class="other-username-title">{{
                                otherUsername
                            }}</span>
                            about
                            <span class="category-title"
                                >{{ category }}
                            </span></span
                        >
                    </a-row>
                    <a-row class="text-container">
                        <a-col :span="24">
                            <a-row class="message-output">
                                <a-col :span="24">
                                    <a-row
                                        v-for="(message, index) in messages"
                                        :key="index"
                                    >
                                        <a-col :span="24" class="message-col">
                                            <span
                                                v-if="message.isLocal"
                                                class="message-username local"
                                                >me:</span
                                            >
                                            <span
                                                v-else
                                                class="message-username other"
                                                >{{ message.username }}:</span
                                            >
                                            &nbsp;
                                            <span
                                                class="message-text"
                                                :class="{
                                                    'local-message':
                                                        message.isLocal,
                                                    'remote-message': !message.isLocal
                                                }"
                                                >{{ message.text }}</span
                                            >
                                        </a-col>
                                    </a-row>
                                </a-col>
                            </a-row>
                            <a-row style="padding-top: 10px">
                                <a-col :span="24">
                                    <span
                                        class="user-typing"
                                        :class="{ hidden: !isOtherUserTyping }"
                                        style="display:block"
                                        >{{ otherUsername }} is typing...
                                    </span>
                                </a-col>
                            </a-row>
                            <a-row align="center" class="send-message-row">
                                <a-col :span="20">
                                    <a-input
                                        placeholder="Send a message"
                                        v-model="currentMessageInput"
                                        @keydown="handleKeyDown"
                                        @keyup="handleKeyUp"
                                    ></a-input>
                                </a-col>
                                <a-col :span="4">
                                    <a-button
                                        type="primary"
                                        @click="sendMessage"
                                        >Send</a-button
                                    >
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                </a-col>

                <a-col :span="6"> </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import Vue from "vue";
import User from "@/models/User";
import { socket } from "../App.vue";
import Statics from "../shared/statics";

let typingTimer: number;
const finishedTypingInterval = 5000;

interface Message {
    username: string;
    text: string;
    isLocal: boolean;
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
            category: Statics.CurrentCategory,
            isOtherUserTyping: false
        };
    },
    mounted() {
        socket.on("messageReceived", (data: Message) => {
            data.isLocal = this.isLocalMessage(data);
            this.messages.push(data);
        });

        socket.on("startedTyping", (data: any) => {
            if (data.username !== Statics.Username) {
                this.isOtherUserTyping = true;
            }
        });
        socket.on("stoppedTyping", (data: any) => {
            if (data.username !== Statics.Username) {
                this.isOtherUserTyping = false;
            }
        });
    },

    methods: {
        handleKeyDown(event: KeyboardEvent) {
            if (event.keyCode === 13) {
                this.sendMessage();
            }
            clearTimeout(typingTimer);
        },
        handleKeyUp(event: KeyboardEvent) {
            clearTimeout(typingTimer);
            if (event.keyCode !== 13) {
                typingTimer = setTimeout(
                    this.finishedTyping,
                    finishedTypingInterval
                );
                socket.emit("startedTyping", {
                    username: Statics.Username
                });
            }
        },
        sendMessage() {
            socket.emit("messageSent", {
                text: this.currentMessageInput,
                username: Statics.Username
            });
            this.currentMessageInput = "";
            this.emitStoppedTyping();
        },
        emitStoppedTyping() {
            socket.emit("stoppedTyping", {
                username: Statics.Username
            });
        },
        preventNav(e: any) {
            e.preventDefault();
            e.returnValue = "";
        },

        finishedTyping() {
            this.emitStoppedTyping();
        },

        isLocalMessage(message: Message) {
            return message.username === Statics.Username;
        },

        goBack() {
            this.$router.back();
        }
    },
    beforeMount() {
        window.addEventListener("beforeunload", this.preventNav);
    },

    beforeDestroy() {
        // Don't forget to clean up event listeners
        window.removeEventListener("beforeunload", this.preventNav);
        clearTimeout(typingTimer);
    }
});
</script>

<style scoped>
.text-container {
    border: 1px solid black;
    height: 600px;
    background: white;
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

.message-username.local {
    color: blue;
}

.message-username.other {
    color: grey;
}

.message-output > .ant-col > .ant-row {
    max-height: 100%;
}

.text-container > .ant-col > .message-output {
    height: 523px;
    overflow: auto;
}

.send-message-row {
    margin-top: -40px;
}

.user-typing {
    font-size: 12px;
    font-style: italic;
    margin-top: -10px;
    margin-left: 5px;
}

.message-text {
    font-size: 14px;
}

.message-col {
    padding-top: 0px;
    padding-bottom: 0px;
    padding-left: 5px;
}

.info-title {
    font-size: 24px;

    text-align: center;
}
</style>
