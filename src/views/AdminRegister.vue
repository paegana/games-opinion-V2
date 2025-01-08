<template>
    <div class="register-container">
      <h1>Registro de Administrador</h1>
      <form @submit.prevent="registerAdmin">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input v-model="name" id="name" type="text" placeholder="Ingrese su nombre" required />
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
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Ingrese una contraseña"
            required
          />
        </div>
        <button class="auth-button" type="submit">Registrar</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: "",
        lastName: "",
        password: "",
      };
    },
    methods: {
      registerAdmin() {
        const adminData = {
          name: this.name,
          lastName: this.lastName,
          password: this.password,
        };
  
        const admins = JSON.parse(localStorage.getItem("admins")) || [];
        admins.push(adminData);
        localStorage.setItem("admins", JSON.stringify(admins));
  
        alert("Administrador registrado exitosamente");
        this.$router.push("/admin-login");
      },
    },
  };
  </script>
  
  <style>
  /* Similar al diseño de AdminLogin.vue */
  </style>
  