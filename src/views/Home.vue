<template>
  <div class="container my-5">
    <h1 class="text-center mb-4 text-light">Lista de Juegos Disponibles</h1>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="game in games" :key="game.id">
        <div class="card h-100 shadow-sm bg-dark text-light">
          <img
            :src="game.background_image || 'https://via.placeholder.com/300x180'"
            class="card-img-top"
            alt="Imagen del juego"
          />
          <div class="card-body">
            <h5 class="card-title">{{ game.name }}</h5>
            <p class="card-text">Rating: <strong>{{ game.rating }}</strong></p>
            <p class="card-text">Released: {{ game.released }}</p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button
              class="btn btn-primary btn-sm w-50 me-2"
              @click="goToOpiniones(game.name)"
            >
              Opinar
            </button>
            <button
              class="btn btn-danger btn-sm w-50"
              :class="{ liked: isLiked(game.name) }"
              @click="toggleLike(game.name)"
            >
              ❤️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "vue-router";

export default {
  name: "Home",
  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    // Variables locales y estado
    const games = ref([]);
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const userLikes = computed(() => userStore.getUserLikes || []); // Asegúrate de que siempre sea un array

    // Métodos
    const fetchGames = async () => {
      try {
        const response = await fetch(
          "https://api.rawg.io/api/games?key=c869e52a91b04a7db422191aeb2a776f"
        );
        const data = await response.json();
        games.value = data.results;
      } catch (error) {
        console.error("Error al cargar los juegos:", error);
      }
    };

    const goToOpiniones = (gameTitle) => {
      if (!isAuthenticated.value) {
        alert("Debes iniciar sesión para opinar sobre un juego.");
        router.push("/login");
        return;
      }
      router.push({ name: "Opiniones", params: { title: gameTitle } });
    };

    const toggleLike = (gameTitle) => {
      if (!isAuthenticated.value) {
        alert("Debes iniciar sesión para marcar juegos como favoritos.");
        router.push("/login");
        return;
      }

      if (isLiked(gameTitle)) {
        userStore.removeLike(gameTitle);
        alert(`Quitaste el favorito del juego: ${gameTitle}`);
      } else {
        userStore.addLike(gameTitle);
        alert(`¡Le diste me gusta al juego: ${gameTitle}!`);
      }
    };

    const isLiked = (gameTitle) => {
      // Asegúrate de que userLikes.value sea siempre un array
      return userLikes.value?.includes(gameTitle);
    };

    // Cargar juegos al montar
    onMounted(() => {
      fetchGames();
    });

    return {
      games,
      isAuthenticated,
      isLiked,
      goToOpiniones,
      toggleLike,
    };
  },
};
</script>

<style scoped>
.card-img-top {
  height: 180px;
  object-fit: cover;
}
.liked {
  background-color: #dc3545;
  color: white;
}
</style>
