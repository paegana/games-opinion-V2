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
    FormularioCoins, // Importamos el formulario de Coins
  },
  setup() {
    const userStore = useUserStore();

    // Verificar si el usuario es administrador
    const isAdmin = computed(() => userStore.isAdmin);

    // Obtener todas las opiniones
    const opinions = computed(() => {
      const allOpinions = [];
      Object.keys(userStore.userData).forEach((user) => {
        const userOpinions = userStore.userData[user]?.opinions || [];
        userOpinions.forEach((opinion) => {
          if (isAdmin.value || user === userStore.loggedInUser) {
            allOpinions.push({ ...opinion, user }); // Añadir nombre del usuario
          }
        });
      });
      return allOpinions;
    });

    // Mapeo de juegos con sus opiniones y likes
    const gamesWithOpinions = computed(() => {
      const games = {};

      // Mapear opiniones por juego
      opinions.value.forEach((opinion) => {
        if (!games[opinion.game]) {
          games[opinion.game] = { title: opinion.game, likes: 0, opinions: [] };
        }
        games[opinion.game].opinions.push(opinion);
      });

      // Contar likes por juego
      Object.keys(games).forEach((gameTitle) => {
        games[gameTitle].likes = Object.values(userStore.userData).reduce(
          (count, user) => {
            const likes = user.likes || [];
            return count + (likes.includes(gameTitle) ? 1 : 0);
          },
          0
        );
      });

      // Agregar juegos con solo likes (sin opiniones)
      const allGames = Object.values(games);
      const gamesWithLikesOnly = Object.values(userStore.userData)
        .flatMap((user) => user.likes || [])
        .filter((gameTitle) => !games[gameTitle])
        .map((gameTitle) => ({
          title: gameTitle,
          likes: 1,
          opinions: [],
        }));

      return allGames.concat(gamesWithLikesOnly);
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
