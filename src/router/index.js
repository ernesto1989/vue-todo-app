import { createRouter, createWebHistory } from 'vue-router'
import TaskView from '../views/TaskView.vue'
import LoginView from '../views/LoginView.vue'
import NotFound from '../views/NotFound.vue'
import ServerError from '../views/ServerError.vue'
import RegisterView from '../views/RegisterView.vue'

const routes = [
    { path: '/', redirect: '/tasks' },
    { path: '/login', component: LoginView },
    { path: '/tasks', component: TaskView, meta: { requiresAuth: true } },
    { path: '/register', component: RegisterView },
    { path: '/500', component: ServerError },
    { path: '/:pathMatch(.*)*', component: NotFound } // 404 fallback
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta.requiresAuth;
    const token = localStorage.getItem('token');

    if (requiresAuth && !token) {
        next('/login');
    } else {
        next(); // allow navigation
    }
});

export default router