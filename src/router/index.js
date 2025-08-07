import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '@/views/NotFound.vue';
import LoginPage from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import AllBenefeciaries from '@/views/AllBenefeciaries.vue';
import NewBenefeciary from '@/views/NewBenefeciary.vue';
import Help from '@/views/Help.vue';
import About from '@/views/About.vue';
import Settings from '@/views/Settings.vue';
import { useAuthStore } from '@/stores/auth';

const routes = [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    { path: '/', name: 'LoginPage', component: LoginPage, meta: { requiresAuth: false } },
    { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
    { path: '/all-benefeciaries', name: 'AllBenefeciaries', component: AllBenefeciaries, meta: { requiresAuth: true } },
    { path: '/new-benefeciary', name: 'NewBenefeciary', component: NewBenefeciary, meta: { requiresAuth: true } },
    { path: '/help', name: 'Help', component: Help, meta: { requiresAuth: true } },
    { path: '/about', name: 'About', component: About, meta: { requiresAuth: true } },
    { path: '/settings', name: 'Settings', component: Settings, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    authStore.checkAuth();
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return '/';
    }
    
    if (to.path === '/' && authStore.isAuthenticated) {
        return '/about';
    }
});

export default router;
