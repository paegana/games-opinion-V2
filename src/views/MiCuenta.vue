<template>
    <div class="mi-cuenta">
      <h2>Bienvenido, {{ user.name }}</h2>
      <p>Tu correo: {{ user.email }}</p>
      <div v-if="likes.length">
        <h3>Juegos que te gustan:</h3>
        <ul>
          <li v-for="like in likes" :key="like">{{ like }}</li>
        </ul>
      </div>
      <div v-else>
        <p>No has marcado juegos como favoritos todavía.</p>
      </div>
      <div>
        <h3>Tu actividad:</h3>
        <p>Comentarios realizados: {{ comments.length }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "MiCuenta",
    data() {
      return {
        user: {
          name: localStorage.getItem("userFullName") || "Usuario",
          email: localStorage.getItem("userEmail") || "Sin correo",
        },
        likes: JSON.parse(localStorage.getItem("userLikes")) || [],
        comments: JSON.parse(localStorage.getItem("userComments")) || [],
      };
    },
  };
  </script>
  
  <style>
  .mi-cuenta {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin: 2rem auto;
    max-width: 600px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  </style>
  