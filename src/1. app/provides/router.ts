import {createRouter, createWebHashHistory} from 'vue-router';
import {routes} from '@/2. pages';

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})