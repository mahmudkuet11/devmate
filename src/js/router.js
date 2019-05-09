import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from './components/Dashboard';
import NginxVHost from './components/NginxVHost';
import Terminal from './components/Terminal';

Vue.use(VueRouter);

const routes = [
    {path: '/', component: Dashboard},
    {path: '/nginx-vhost', component: NginxVHost},
    {path: '/terminal', component: Terminal},
];

const router = new VueRouter({
    routes
});

export default router;