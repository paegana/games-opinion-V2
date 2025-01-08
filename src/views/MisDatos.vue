<template>
    <div>
      <h2>Mis Opiniones y Likes</h2>
      <div v-if="userData">
        <h3>Likes:</h3>
        <ul>
          <li v-for="game in userData.likes" :key="game">{{ game }}</li>
        </ul>
        <h3>Opiniones:</h3>
        <ul>
          <li v-for="opinion in userData.opinions" :key="opinion.game">
            <strong>{{ opinion.game }}:</strong> {{ opinion.comment }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No se encontraron datos.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { useUserStore } from "../stores/userStore";
  
  export default {
    setup() {
      const userStore = useUserStore();
      return {
        userData: userStore.userData[userStore.loggedInUser],
      };
    },
  };
  </script>
  