import Vue from "vue";
import App from "./App.vue";
import Lobby from "@/components/Lobby.vue";
import SearchPage from "@/components/SearchPage.vue";
import VueRouter from "vue-router";
import Statics from "./shared/statics";
import 'ant-design-vue/dist/antd.css';
import Antd from "ant-design-vue"
const routes = [
    { path: "/", component: SearchPage },
    { path: "/lobby", component: Lobby, props: true, name: "lobby" },
];

function generateRandomUsername(): string {
    const username = new Date().getTime().toString();
    return username;
}

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    routes, // short for `routes: routes`
});
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Antd);

Statics.Username = generateRandomUsername();

new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");
