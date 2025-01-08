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
    component: Home,
  },
  {
    path: "/opiniones/:title",
    name: "Opiniones",
    component: Opiniones,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/admin-login",
    name: "AdminLogin",
    component: AdminLogin,
  },
  {
    path: "/administracion",
    name: "Administracion",
    component: Administracion,
    meta: { requiresAdmin: true },
  },
  {
    path: "/opiniones",
    name: "OpinionesGenerales",
    component: OpinionesGenerales,
    meta: { requiresAuth: true },
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global para manejo de accesos
router.beforeEach((to, from, next) => {
  const userStore = useUserStore(); // Accede al store global de usuarios

  // Manejo de rutas protegidas
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return next({
      name: "Login",
      query: { redirect: to.fullPath }, // Redirige al usuario después de autenticarse
    });
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return next({
      name: "AdminLogin",
      query: { redirect: to.fullPath }, // Redirige al usuario después de autenticarse
    });
  }

  next(); // Permite el acceso si no se activa ninguna restricción
});

export default router;
