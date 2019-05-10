import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from './components/Dashboard';
import NginxVHost from './components/NginxVHost';
import Nginx from './components/Nginx';

Vue.use(VueRouter);

const routes = [
    {path: '/', component: Dashboard},
    {path: '/nginx', component: Nginx},
    {path: '/nginx-vhost', component: NginxVHost},
];

const router = new VueRouter({
    routes
});

export default router;