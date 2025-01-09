import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    loggedInUser: null, // Usuario autenticado (admin o usuario normal)
    userData: {}, // Datos de los usuarios: likes y opiniones
    adminData: {
      adminName: null, // Nombre del administrador
      adminPassword: null, // Contraseña del administrador
    },
    isAdmin: false, // Verifica si el usuario autenticado es administrador
  }),
  getters: {
    isAuthenticated: (state) => !!state.loggedInUser,

    getUserLikes: (state) => {
      if (!state.loggedInUser) return [];
      return state.userData[state.loggedInUser]?.likes || [];
    },

    getUserOpinions: (state) => (gameTitle) => {
      if (!state.loggedInUser) return [];
      return (
        state.userData[state.loggedInUser]?.opinions?.filter(
          (opinion) => opinion.game === gameTitle
        ) || []
      );
    },

    getAllOpinions: (state) => {
      const allOpinions = [];
      for (const user in state.userData) {
        const opinions = state.userData[user]?.opinions || [];
        opinions.forEach((opinion) =>
          allOpinions.push({
            user, // Usuario
            game: opinion.game, // Juego
            text: opinion.text, // Texto de la opinión
            timestamp: opinion.timestamp, // Fecha y hora
          })
        );
      }
      return allOpinions;
    },

    getAllLikes: (state) => {
      const likeSummary = {};
      for (const user in state.userData) {
        const likes = state.userData[user]?.likes || [];
        likes.forEach((game) => {
          if (!likeSummary[game]) {
            likeSummary[game] = { game, users: [], likes: 0 };
          }
          likeSummary[game].users.push(user);
          likeSummary[game].likes += 1;
        });
      }
      return Object.values(likeSummary);
    },
  },
  actions: {
    loginUser(name, password) {
      // Verificar credenciales de administrador
      if (
        name === this.adminData.adminName &&
        password === this.adminData.adminPassword
      ) {
        this.isAdmin = true;
        this.loggedInUser = name;
        return true;
      }

      // Registrar automáticamente si el usuario no existe
      if (!this.userData[name]) {
        this.userData[name] = { likes: [], opinions: [] }; // Crear un nuevo usuario
      }

      // Iniciar sesión como usuario normal
      this.loggedInUser = name;
      this.isAdmin = false;
      return true;
    },

    createAdminUser(name, password) {
      if (this.adminData.adminName) {
        throw new Error("Ya existe un administrador registrado.");
      }
      if (!name || !password) {
        throw new Error("El nombre y la contraseña son obligatorios.");
      }
      this.adminData.adminName = name;
      this.adminData.adminPassword = password;
      this.isAdmin = true;
      this.loggedInUser = name;
    },

    logout() {
      this.loggedInUser = null;
      this.isAdmin = false;
    },

    addLike(gameTitle) {
      if (!this.loggedInUser) {
        throw new Error("Debes iniciar sesión para dar like.");
      }
      if (!this.userData[this.loggedInUser]) {
        this.userData[this.loggedInUser] = { likes: [], opinions: [] };
      }
      const userLikes = this.userData[this.loggedInUser].likes;
      if (!userLikes.includes(gameTitle)) {
        userLikes.push(gameTitle);
      } else {
        throw new Error("Ya has dado like a este juego.");
      }
    },

    removeLike(gameTitle) {
      if (!this.loggedInUser) {
        throw new Error("Debes iniciar sesión para quitar el like.");
      }
      const userLikes = this.userData[this.loggedInUser]?.likes || [];
      this.userData[this.loggedInUser].likes = userLikes.filter(
        (likedGame) => likedGame !== gameTitle
      );
    },

    addOpinion(gameTitle, opinionText) {
      if (!this.loggedInUser) {
        throw new Error("Debes iniciar sesión para opinar.");
      }
      if (!this.userData[this.loggedInUser]) {
        this.userData[this.loggedInUser] = { likes: [], opinions: [] };
      }
      const opinions = this.userData[this.loggedInUser]?.opinions || [];
      opinions.push({
        id: Date.now(),
        game: gameTitle,
        text: opinionText,
        timestamp: new Date().toISOString(),
      });
      this.userData[this.loggedInUser].opinions = opinions;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "userStore",
        storage: localStorage,
        paths: ["loggedInUser", "userData", "adminData", "isAdmin"],
      },
    ],
  },
});
