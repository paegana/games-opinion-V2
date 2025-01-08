<template>
  <div class="sidebar">
    <!-- Información del Usuario o Administrador -->
    <div class="user-info">
      <div class="avatar">
        <img src="https://via.placeholder.com/50" alt="Avatar" />
      </div>
      <h4>Bienvenid@</h4>
      <p>{{ userName }}</p>
    </div>

    <!-- Navegación -->
    <nav class="navigation">
      <ul>
        <li>
          <router-link
            class="btn btn-primary w-100 mb-2"
            :to="isAdmin ? '/administracion' : '/mi-cuenta'"
          >
            Resumen
          </router-link>
        </li>
        <li>
          <button class="btn btn-danger w-100" @click="logout">
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { computed } from "vue";
import { useUserStore } from "@/store/userStore";

export default {
  props: ["isAdmin"],
  setup() {
    const userStore = useUserStore();

    // Computed para obtener el nombre del usuario desde el store
    const userName = computed(() => userStore.loggedInUser || "Usuario");

    // Método para cerrar sesión
    const logout = () => {
      userStore.logout(); // Manejar el logout desde el store
      localStorage.clear(); // Limpia cualquier dato residual en localStorage
      window.location.reload(); // Opcional: Refresca la aplicación
    };

    return {
      userName,
      logout,
    };
  },
};
</script>

<style scoped>
.sidebar {
  width: 220px;
  background: #333;
  color: white;
  height: 100vh;
  padding: 1rem;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);
}

.user-info {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar img {
  border-radius: 50%;
  width: 60px;
  height: 60px;
}

.navigation ul {
  list-style: none;
  padding: 0;
}

.navigation li {
  margin-bottom: 1rem;
}

.navigation .btn {
  font-size: 1rem;
  text-align: center;
}
</style>
