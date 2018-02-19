import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '../views/app.vue';
import Home from '../views/pages/home.vue';
import Example from '../views/pages/example.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/example',
        component: Example
    }
];

const router = new VueRouter({
    routes,
    mode: 'history'
});

new Vue({
    el: '#app',
    router,
    render: (createElement) => createElement(App)
});
