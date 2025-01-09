<template>
  <div class="login-container">
    <h1>Iniciar Sesión</h1>
    <!-- Formulario de autenticación -->
    <form @submit.prevent="authenticateUser">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input
          v-model="name"
          id="name"
          type="text"
          placeholder="Ingrese su nombre"
          required
        />
      </div>
      <div class="form-group">
        <label for="lastName">Apellido</label>
        <input
          v-model="lastName"
          id="lastName"
          type="text"
          placeholder="Ingrese su apellido"
          required
        />
      </div>
      <!-- Mostrar mensaje de error -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button class="auth-button" type="submit">Iniciar Sesión</button>
    </form>
  </div>
</template>

<script>
import { useUserStore } from "@/store/userStore"; // Importar el store de usuarios
import { useRoute, useRouter } from "vue-router";

export default {
  data() {
    return {
      name: "",
      lastName: "",
      errorMessage: "",
    };
  },
  setup() {
    const userStore = useUserStore(); // Conectar con el store de usuarios
    const router = useRouter(); // Redirección después de login
    const route = useRoute(); // Obtener la ruta previa
    return { userStore, router, route };
  },
  methods: {
    authenticateUser() {
      if (!this.name.trim() || !this.lastName.trim()) {
        this.errorMessage = "Por favor, completa todos los campos.";
        return;
      }

      const fullName = `${this.name.trim()} ${this.lastName.trim()}`;
      try {
        const success = this.userStore.loginUser(fullName); // Inicia sesión o registra al usuario
        if (success) {
          this.errorMessage = "";
          const redirectPath = this.route.query.redirect || "/"; // Redirigir a la página anterior o al home
          this.router.push(redirectPath);
        } else {
          this.errorMessage = "Error al iniciar sesión. Inténtalo nuevamente.";
        }
      } catch (error) {
        this.errorMessage = error.message || "Error al iniciar sesión.";
      }
    },
  },
};
</script>

<style scoped>
/* Contenedor principal */
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Grupos de formulario */
.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

/* Botón de autenticación */
.auth-button {
  width: 100%;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.auth-button:hover {
  background-color: #0056b3;
}

/* Mensaje de error */
.error-message {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
</style>
