<template>
    <div class="card shadow-sm p-3 mb-4">
      <h5 class="card-title">Resumen de tu cuenta</h5>
      <p class="card-text">Le diste me gusta al juego <strong>{{ juego }}</strong></p>
  
      <!-- Mostrar mensaje y formulario -->
      <div v-if="credit < maxCredit">
        <label for="coinsInput">¿Deseas comprar coins para este juego?</label>
        <div class="d-flex align-items-center mt-2">
          <button
            class="btn btn-warning"
            @click="addCoins"
            :disabled="credit >= maxCredit"
          >
            <i class="fas fa-coins"></i> Agregar coins
          </button>
        </div>
      </div>
  
      <!-- Mostrar mensaje de crédito máximo -->
      <div v-else>
        <p class="text-danger mt-3">Llegaste al máximo de tu crédito</p>
      </div>
  
      <!-- Barra de progreso -->
      <div class="mt-3">
        <p class="mb-2">Cantidad de coins comprados</p>
        <div class="progress" style="height: 20px;">
          <div
            class="progress-bar"
            role="progressbar"
            :style="{ backgroundColor: progressBarColor, width: `${progress}%` }"
          >
            $ {{ credit }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      juego: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        credit: 0, // Crédito inicial
        maxCredit: 50, // Límite de crédito
      };
    },
    computed: {
      progress() {
        return (this.credit / this.maxCredit) * 100;
      },
      progressBarColor() {
        if (this.credit <= 20) return "green";
        if (this.credit > 20 && this.credit <= 30) return "yellow";
        return "red";
      },
    },
    methods: {
      addCoins() {
        if (this.credit + 10 <= this.maxCredit) {
          this.credit += 10; // Agregar coins
        } else {
          alert("No puedes agregar más coins.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .card {
    max-width: 400px;
  }
  .progress-bar {
    color: white;
    font-weight: bold;
    text-align: center;
  }
  </style>
  