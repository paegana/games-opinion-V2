<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <!-- Logo -->
      <router-link class="navbar-brand" to="/">Games Opinion</router-link>

      <!-- Botón de colapsar para dispositivos pequeños -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menú de navegación -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Inicio</router-link>
          </li>
          <!-- Opiniones: solo para usuarios autenticados y no administradores -->
          <li v-if="isAuthenticated && !isAdmin" class="nav-item">
            <router-link class="nav-link" to="/opiniones">Opiniones</router-link>
          </li>
          <!-- Administración: solo para administradores -->
          <li v-if="isAuthenticated && isAdmin" class="nav-item">
            <router-link class="nav-link" to="/administracion">Administración</router-link>
          </li>
        </ul>

        <!-- Acciones de usuario -->
        <ul class="navbar-nav">
          <!-- Mostrar bienvenida si está autenticado -->
          <li v-if="isAuthenticated" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="userMenu"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Bienvenid@, {{ loggedInUser }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
              <li>
                <button class="dropdown-item" @click="logout">Cerrar Sesión</button>
              </li>
            </ul>
          </li>

          <!-- Enlaces de login si no está autenticado -->
          <li v-else>
            <router-link class="btn btn-primary btn-sm me-2" to="/login">
              Login Usuarios
            </router-link>
            <router-link class="btn btn-secondary btn-sm" to="/admin-login">
              Login Administración
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router"; // Importar el enrutador de Vue
import { useUserStore } from "@/store/userStore";

export default {
  setup() {
    const userStore = useUserStore();
    const router = useRouter(); // Instancia del enrutador

    // Computed properties
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const isAdmin = computed(() => userStore.isAdmin);
    const loggedInUser = computed(() => userStore.loggedInUser);

    // Logout function
    const logout = () => {
      const confirmLogout = confirm("¿Estás seguro de que quieres cerrar sesión?");
      if (confirmLogout) {
        userStore.logout();
        router.push("/"); // Redirige al Home
      }
    };

    return {
      isAuthenticated,
      isAdmin,
      loggedInUser,
      logout,
    };
  },
};
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
}

.nav-link {
  color: white !important;
  text-decoration: none;
}

.nav-link:hover {
  color: #ccc !important;
}

.dropdown-menu {
  background-color: #333;
  border: none;
}

.dropdown-item {
  color: white !important;
}

.dropdown-item:hover {
  background-color: #444;
}
</style>
