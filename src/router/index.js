import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Login from "../views/Login.vue"
import Dashboard from "../views/Dashboard.vue"

const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component : Login
    },
     {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // If authenticated user visits login → redirect to dashboard
  if (to.path === '/login' && auth.isAuthenticated) return '/dashboard'

  // If not authenticated and trying to access protected routes → redirect to login
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'

  return true
})
export default router