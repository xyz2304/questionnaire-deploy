<script setup>
import livres from "@/data/livresData.json";
import NavBar from "@/components/NavBarComponent.vue";
</script>

<template>
  <header>
    <NavBar json_name="NavBarAccueilData.json" />
  </header>
  <main class="accueil-view flex-shrink-0">
    <!-- Bannière de Bienvenue -->
    <div class="text-center bg-light p-5 mb-4 shadow-sm">
      <h1 class="mb-3">مرحبا بكم في عالم القراءة و المتعة و الخيال</h1>
      <p class="lead">.شاركنا تجربة القراءة الخاصة بك</p>
    </div>
    <!-- Section des Livres Populaires -->
    <div class="container">
      <h2 class="mb-4">مجموعة القصص</h2>
      <div class="row g-4 row justify-content-center">
        <div class="col-md-4" v-for="livre in livres" :key="livre.id">
          <div class="card h-100 text-center"> <!-- Ajout de text-center pour centrer le texte et les images -->
            <div class="card-header">
              <h5 class="card-title">{{ livre.titre }}</h5>
            </div>
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <!-- Flexbox pour centrer verticalement et horizontalement -->
              <p class="card-text">{{ livre.description }}</p>
              <!-- Conditionally display image based on title -->
              <img v-if="livre.titre === 'حلم فراشة'" src="@/gifs/papillonLivre.jpeg" class="img-fluid rounded my-2"
                alt="Image de papillon" /> <!-- img-fluid pour responsive design -->
              <img v-if="livre.titre === 'بطوط يبحث عن مهنة'" src="@/gifs/donaldLivre.jpeg"
                class="img-fluid rounded my-2" alt="Image de Donald" />
            </div>
            <div class="card-footer text-muted"> <!-- text-muted pour le style du texte -->
              الكاتب : {{ livre.auteur }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.card {
  border-radius: 15px;
  border: 1px solid #bde0fe;
  overflow: hidden;
  transition: transform 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.card:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.card-title {
  color: #333;
  font-family: "Fredoka One", cursive;
}

.card-body {
  background-color: #e7f2f8;
}

.card-footer {
  background-color: #bde0fe;
  color: #333;
}

.container {
  padding-top: 2rem;
}

h1 {
  color: #5cacee;
  font-family: "Fredoka One", cursive;
}

h2,
.lead {
  font-family: "Fredoka One", cursive;
  color: #333;
}
</style>
