import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Opiniones from "../views/Opiniones.vue";
import Login from "../views/Login.vue";
import Administracion from "../views/Administracion.vue";
import OpinionesGenerales from "../views/OpinionesGenerales.vue";
import AdminLogin from "../views/AdminLogin.vue";
import NotFound from "../views/NotFound.vue";
import { useUserStore } from "@/store/userStore";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home, // Página principal
  },
  {
    path: "/opiniones/:title",
    name: "Opiniones",
    component: Opiniones,
    props: true, // Permite pasar params como props
    meta: { requiresAuth: true }, // Solo usuarios autenticados
  },
  {
    path: "/login",
    name: "Login",
    component: Login, // Página de login de usuarios
  },
  {
    path: "/admin-login",
    name: "AdminLogin",
    component: AdminLogin, // Página de login de administradores
  },
  {
    path: "/administracion",
    name: "Administracion",
    component: Administracion, // Vista de administración
    meta: { requiresAdmin: true }, // Solo accesible por administradores
  },
  {
    path: "/opiniones",
    name: "OpinionesGenerales",
    component: OpinionesGenerales, // Vista de opiniones generales
    meta: { requiresAuth: true }, // Solo usuarios autenticados
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/", // Redirige rutas no encontradas a la página principal
  },
];

const router = createRouter({
  history: createWebHistory("/games-opinion-V2/"), // Base URL para GitHub Pages
  routes,
});

// Guard global para proteger rutas
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: "Login", query: { redirect: to.fullPath } });
  } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next({ name: "AdminLogin", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
