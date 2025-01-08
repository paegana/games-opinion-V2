<template>
  <div class="admin-login-container">
    <h1 v-if="isNewAdmin">Registro de Administrador</h1>
    <h1 v-else>Login Administración</h1>
    <form @submit.prevent="handleLoginOrRegister">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input v-model="name" id="name" type="text" placeholder="Ingrese su nombre" required />
      </div>
      <div class="form-group">
        <label for="lastName">Apellido</label>
        <input v-model="lastName" id="lastName" type="text" placeholder="Ingrese su apellido" required />
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input v-model="password" id="password" type="password" placeholder="Ingrese su contraseña" required />
      </div>

      <!-- Confirmar contraseña solo al registrar -->
      <div v-if="isNewAdmin" class="form-group">
        <label for="confirmPassword">Confirmar Contraseña</label>
        <input
          v-model="confirmPassword"
          id="confirmPassword"
          type="password"
          placeholder="Confirme su contraseña"
          required
        />
      </div>

      <button class="login-button" type="submit">
        {{ isNewAdmin ? "Registrar Administrador" : "Iniciar Sesión" }}
      </button>

      <!-- Link a registro -->
      <div v-if="!isNewAdmin">
        <p class="mt-2">
          ¿No tienes cuenta? 
          <button class="btn btn-link p-0" @click.prevent="redirectToRegister">Registrarse</button>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { useUserStore } from "@/store/userStore";

export default {
  data() {
    return {
      name: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      isNewAdmin: false, // Determina si estamos registrando un nuevo administrador
    };
  },
  computed: {
    fullName() {
      return `${this.name} ${this.lastName}`;
    },
  },
  mounted() {
    const adminName = localStorage.getItem("adminName");
    const registerQuery = this.$route.query.register;

    // Si no hay administrador registrado y se accede a registro
    if (!adminName && registerQuery === "true") {
      this.isNewAdmin = true;
    }
  },
  methods: {
    handleLoginOrRegister() {
      const userStore = useUserStore();

      if (this.isNewAdmin) {
        // Registro de nuevo administrador
        if (this.password !== this.confirmPassword) {
          alert("Las contraseñas no coinciden.");
          return;
        }

        try {
          userStore.createAdminUser(this.fullName, this.password);
          alert("Administrador registrado con éxito.");
          this.$router.push("/admin-login"); // Redirige al formulario de login
        } catch (error) {
          alert(error.message);
        }
      } else {
        // Inicio de sesión como administrador
        try {
          userStore.loginUser(this.fullName, this.password);
          if (userStore.isAdmin) {
            alert("Sesión iniciada como administrador.");
            this.$router.push("/administracion");
          } else {
            alert("Acceso restringido. Solo administradores pueden ingresar.");
          }
        } catch (error) {
          alert(error.message);
        }
      }
    },
    redirectToRegister() {
      // Redirige al registro agregando un parámetro en la query
      this.$router.push({ name: "AdminLogin", query: { register: true } });
      this.isNewAdmin = true; // Activa el estado de registro
    },
  },
};
</script>

<style>
.admin-login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
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
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
}

.login-button:hover {
  background-color: #218838;
}

.btn-link {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}
</style>
