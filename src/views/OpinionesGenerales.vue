<template>
  <div class="container my-5">
    <h1 class="text-center mb-4 text-light">Opiniones Generales</h1>

    <div v-for="game in gamesWithOpinions" :key="game.title" class="mb-4">
      <!-- Cabecera del juego -->
      <h3 class="text-light">{{ game.title }}</h3>
      <p class="text-warning">Total Likes: {{ game.likes }}</p>

      <!-- Lista de opiniones -->
      <ul class="list-group">
        <li
          v-for="opinion in game.opinions"
          :key="opinion.id"
          class="list-group-item bg-dark text-light"
        >
          <div><strong>{{ opinion.user }}</strong>: {{ opinion.text }}</div>
          <div class="text-muted">{{ formatDate(opinion.timestamp) }}</div>
        </li>
      </ul>

      <!-- Mensaje si no hay opiniones -->
      <div v-if="game.opinions.length === 0" class="text-muted mt-2">
        Este juego tiene {{ game.likes }} likes, pero no tiene opiniones.
      </div>

      <!-- Formulario Coins -->
      <div class="mt-4">
        <formulario-coins :juego="game.title" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useUserStore } from "@/store/userStore";
import FormularioCoins from "@/components/FormularioCoins.vue";

export default {
  name: "OpinionesGenerales",
  components: {
    FormularioCoins,
  },
  setup() {
    const userStore = useUserStore();

    // Verificar si el usuario es administrador
    const isAdmin = computed(() => userStore.isAdmin);

    // Obtener todas las opiniones del usuario autenticado o de todos si es admin
    const opinions = computed(() => {
      const allOpinions = [];
      Object.keys(userStore.userData).forEach((user) => {
        const userOpinions = userStore.userData[user]?.opinions || [];
        userOpinions.forEach((opinion) => {
          if (isAdmin.value || user === userStore.loggedInUser) {
            allOpinions.push({ ...opinion, user });
          }
        });
      });
      return allOpinions;
    });

    // Mapeo de juegos con opiniones y likes
    const gamesWithOpinions = computed(() => {
      const games = {};

      // Mapear opiniones
      opinions.value.forEach((opinion) => {
        if (!games[opinion.game]) {
          games[opinion.game] = { title: opinion.game, likes: 0, opinions: [] };
        }
        games[opinion.game].opinions.push(opinion);
      });

      // Agregar juegos con solo likes
      Object.keys(userStore.userData).forEach((user) => {
        const userLikes =
          user === userStore.loggedInUser || isAdmin.value
            ? userStore.userData[user]?.likes || []
            : [];
        userLikes.forEach((like) => {
          if (!games[like]) {
            games[like] = { title: like, likes: 0, opinions: [] };
          }
        });
      });

      // Contar likes por juego
      Object.keys(games).forEach((gameTitle) => {
        games[gameTitle].likes = Object.keys(userStore.userData).reduce(
          (count, user) => {
            const likes =
              user === userStore.loggedInUser || isAdmin.value
                ? userStore.userData[user]?.likes || []
                : [];
            return count + (likes.includes(gameTitle) ? 1 : 0);
          },
          0
        );
      });

      return Object.values(games);
    });

    // Función para formatear la fecha
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    return { gamesWithOpinions, formatDate, isAdmin };
  },
};
</script>

<style scoped>
.container {
  background-color: #222;
  padding: 20px;
  border-radius: 10px;
}
.list-group-item {
  margin-bottom: 10px;
}
</style>
