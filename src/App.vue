<template>
  <div>
    <!-- Usa los componentes Navbar y Sidebar -->
    <Navbar
      :isAuthenticated="userInfo.isAuthenticated"
      :userRole="userInfo.role"
      @logout="logout"
    />
    <div class="app-container">
      <Sidebar
        v-if="userInfo.isAuthenticated"
        :userRole="userInfo.role"
      />
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "vue-router";

export default {
  name: "App",
  components: {
    Navbar,
    Sidebar,
  },
  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    // Computed para manejar la información del usuario
    const userInfo = computed(() => ({
      isAuthenticated: userStore.isAuthenticated,
      role: userStore.isAdmin ? "admin" : "user",
    }));

    // Cerrar sesión
    const logout = () => {
      userStore.logout();
      router.push("/login"); // Redirige al login después de cerrar sesión
    };

    return {
      userInfo,
      logout,
    };
  },
};
</script>

<style>
/* Diseño para el contenedor principal */
.app-container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}

/* Contenedor principal de contenido */
.content {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }

  .content {
    padding: 10px;
  }
}
</style>
