<template>
  <div class="container my-5">
    <h1 class="text-center mb-4 text-light">Panel de Administración</h1>

    <div v-if="isAdmin" class="text-light">
      <h3>Bienvenido, Administrador</h3>
      <p>Aquí puedes gestionar las opiniones y juegos favoritos de los usuarios.</p>

      <!-- Opiniones de Usuarios -->
      <div v-if="allOpinions.length > 0" class="mt-4">
        <h4>Opiniones de Usuarios</h4>
        <ul class="list-group">
          <li
            v-for="(opinion, index) in allOpinions"
            :key="index"
            class="list-group-item bg-dark text-light"
          >
            <strong>{{ opinion.user }}:</strong> {{ opinion.text }}
            <span class="text-info">(Juego: {{ opinion.game }})</span>
            <small class="text-muted">({{ formatTimestamp(opinion.timestamp) }})</small>
          </li>
        </ul>
      </div>
      <div v-else class="text-warning mt-4">
        <p>No hay opiniones de usuarios registradas.</p>
      </div>

      <!-- Juegos Favoritos con Likes -->
      <div v-if="favoriteGames.length > 0" class="mt-4">
        <h4>Juegos Marcados como Favoritos</h4>
        <ul class="list-group">
          <li
            v-for="(game, index) in favoriteGames"
            :key="index"
            class="list-group-item bg-dark text-light"
          >
            <strong>{{ game.name }}</strong>
            <span class="text-info">(Likes: {{ game.likes }})</span>
            <br />
            <span>Marcado como favorito por:</span>
            <ul>
              <li v-for="(user, idx) in game.users" :key="idx">{{ user }}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div v-else class="text-warning mt-4">
        <p>No hay juegos marcados como favoritos.</p>
      </div>
    </div>

    <!-- Mensaje para usuarios no administradores -->
    <div v-else class="text-danger text-center">
      <h3>No tienes permisos para acceder a esta sección.</h3>
      <router-link to="/" class="btn btn-primary mt-3">Volver al Inicio</router-link>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useUserStore } from "@/store/userStore";

export default {
  setup() {
    const userStore = useUserStore();

    // Verifica si el usuario es administrador
    const isAdmin = computed(() => userStore.isAdmin);

    // Obtener todas las opiniones con información del usuario
    const allOpinions = computed(() => {
      const opinions = [];
      for (const user in userStore.userData) {
        if (userStore.userData[user].opinions) {
          userStore.userData[user].opinions.forEach((opinion) => {
            opinions.push({
              user,
              text: opinion.text,
              game: opinion.game,
              timestamp: opinion.timestamp,
            });
          });
        }
      }
      return opinions;
    });

    // Obtener los juegos favoritos agrupados por nombre, likes y usuarios
    const favoriteGames = computed(() => {
      const gameLikes = {};

      for (const user in userStore.userData) {
        const userLikes = userStore.userData[user]?.likes || [];
        userLikes.forEach((game) => {
          if (!gameLikes[game]) {
            gameLikes[game] = { name: game, users: [], likes: 0 };
          }
          gameLikes[game].users.push(user);
          gameLikes[game].likes += 1;
        });
      }

      return Object.values(gameLikes);
    });

    // Formatear fecha y hora
    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      if (isNaN(date)) return "Fecha no válida";
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    return {
      isAdmin,
      allOpinions,
      favoriteGames,
      formatTimestamp,
    };
  },
};
</script>

<style scoped>
.container {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
}
.list-group-item {
  margin-bottom: 10px;
}
.text-info {
  font-weight: bold;
  color: #17a2b8;
}
.text-warning {
  font-weight: bold;
}
</style>
