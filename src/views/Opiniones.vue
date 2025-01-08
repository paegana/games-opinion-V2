<template>
  <div class="container my-5">
    <h1 class="text-center mb-4 text-light">Tus Opiniones sobre el Juego: {{ gameTitle }}</h1>

    <!-- Mensaje de bienvenida si está autenticado -->
    <div v-if="isAuthenticated" class="mb-4 text-light">
      <h3>Hola, {{ loggedInUser }}</h3>
      <p>Comparte tus opiniones sobre este juego.</p>
    </div>

    <!-- Mensaje si no está autenticado -->
    <div v-else class="text-danger">
      <h3>Debes iniciar sesión para opinar sobre este juego.</h3>
      <router-link to="/login" class="btn btn-primary">Iniciar Sesión</router-link>
    </div>

    <!-- Formulario para agregar una nueva opinión -->
    <div v-if="isAuthenticated" class="mb-4">
      <h4 class="text-light">Agregar tu Opinión</h4>
      <div class="input-group">
        <input
          type="text"
          v-model="newOpinion"
          placeholder="Escribe tu opinión"
          class="form-control"
        />
        <button
          class="btn btn-primary"
          @click="addOpinion"
          :disabled="!newOpinion.trim()"
        >
          Agregar Opinión
        </button>
      </div>
      <small v-if="errorMessage" class="text-danger">{{ errorMessage }}</small>
    </div>

    <!-- Mostrar opiniones del usuario -->
    <div v-if="filteredOpinions.length > 0" class="mt-4">
      <h4 class="text-light">Tus Opiniones</h4>
      <ul class="list-group">
        <li
          v-for="opinion in filteredOpinions"
          :key="opinion.id"
          class="list-group-item bg-dark text-light"
        >
          <p><strong>{{ loggedInUser }}</strong> dijo:</p>
          <p>{{ opinion.text }}</p>
          <small class="text-muted">
            Fecha y hora: {{ new Date(opinion.timestamp).toLocaleString() }}
          </small>
          <div class="mt-2">
            <button
              class="btn btn-warning btn-sm me-2"
              @click="editOpinion(opinion.id, opinion.text)"
            >
              Editar
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteOpinion(opinion.id)"
            >
              Eliminar
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="text-warning mt-4">
      <p>No tienes opiniones para este juego todavía.</p>
    </div>

    <!-- Formulario para comprar coins -->
    <div v-if="filteredOpinions.length > 0" class="mt-5">
      <formulario-coins :juego="gameTitle" />
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/store/userStore";
import { computed, ref } from "vue";
import FormularioCoins from "@/components/FormularioCoins.vue";

export default {
  props: ["title"], // Recibe el título del juego como prop
  components: {
    FormularioCoins,
  },
  setup(props) {
    const userStore = useUserStore();

    // Computed para acceder al estado del store
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const loggedInUser = computed(() => userStore.loggedInUser);

    // Filtrar opiniones del juego actual
    const filteredOpinions = computed(() => {
      if (!isAuthenticated.value) return []; // Si no está autenticado, retorna vacío
      const opinions = userStore.getUserOpinions(props.title);
      return opinions || []; // Garantizar que siempre sea un array
    });

    // Nueva opinión y mensajes de error
    const newOpinion = ref("");
    const errorMessage = ref("");

    // Métodos para manejar opiniones
    const addOpinion = () => {
      if (!newOpinion.value.trim()) {
        errorMessage.value = "La opinión no puede estar vacía.";
        return;
      }
      try {
        userStore.addOpinion(props.title, newOpinion.value.trim());
        newOpinion.value = ""; // Limpia el campo
        errorMessage.value = ""; // Limpia el mensaje de error
      } catch (error) {
        errorMessage.value = "Hubo un error al agregar tu opinión.";
      }
    };

    const editOpinion = (opinionId, currentText) => {
      const newComment = prompt("Edita tu opinión:", currentText);
      if (newComment && newComment.trim()) {
        try {
          userStore.editOpinion(props.title, opinionId, newComment.trim());
        } catch (error) {
          alert("Error al editar la opinión.");
        }
      } else {
        alert("La nueva opinión no puede estar vacía.");
      }
    };

    const deleteOpinion = (opinionId) => {
      if (confirm("¿Estás seguro de eliminar esta opinión?")) {
        try {
          userStore.deleteOpinion(props.title, opinionId);
        } catch (error) {
          alert("Error al eliminar la opinión.");
        }
      }
    };

    return {
      gameTitle: props.title,
      newOpinion,
      errorMessage,
      isAuthenticated,
      loggedInUser,
      filteredOpinions,
      addOpinion,
      editOpinion,
      deleteOpinion,
    };
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
.input-group {
  display: flex;
  align-items: center;
}
</style>
