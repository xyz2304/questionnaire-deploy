<script setup>
import { ref, onMounted } from "vue";
import NavBar from "@/components/NavBarComponent.vue";

const results = ref([]);
const selectedResult = ref(null);
onMounted(() => {
  // Récupérer les résultats depuis le localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("result-")) {
      const resultData = JSON.parse(localStorage.getItem(key));
      results.value.push({
        ...resultData,
        id: key,
        storyName: resultData.storyName,
      });
    }
  });
});
const showDetails = (resultId) => {
  const result = results.value.find((r) => r.id === resultId);
  if (result) {
    selectedResult.value = result;
  }
};
const removeAllResults = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("result-")) {
      localStorage.removeItem(key);
    }
  });
  results.value = []; // Réinitialiser l'affichage
};
</script>

<template>
  <header>
    <NavBar json_name="NavBarParentData.json" />
  </header>
  <main class="container mt-5">
    <div v-for="result in results" :key="result.id" @click="showDetails(result.id)" class="card mb-3 cursor-pointer">
      <div class="card-body">
        <h5 class="card-title">التلميذ: {{ result.childName }}</h5>
        <h5>القصة: {{ result.storyName }}</h5>
        <p class="card-text">النتيجة: {{ result.score }}</p>
      </div>
    </div>
    <div v-if="selectedResult" class="mt-4 questionnaire">
      <h3>تفاصيل الإجابات لـ {{ selectedResult.childName }}</h3>
      <h5>القصة: {{ selectedResult.storyName }}</h5>
      <h5 class="mb-5">
        النتيجة: {{ selectedResult.score }} /
        {{ selectedResult.questions.length }}
      </h5>
      <div v-for="(question, index) in selectedResult.questions" :key="index">
        <h4>{{ question.question }}</h4>
        <ul>
          <li class="fw-bold" v-for="option in question.options" :key="option" :class="{
          correct: option === question.correct_response,
          incorrect:
            selectedResult.answers[index] === option &&
            option !== question.correct_response,
              }">
            {{ option }}
          </li>
        </ul>
      </div>
      <div class="mt-5" v-if="selectedResult.responseText">
        <h5 style="color: #000080;">:الإجابة التي تمّ تسجيلها من قبـل التلميذ</h5>
        <p>{{ selectedResult.responseText }}</p>
      </div>
      <div class="mt-5" v-else>
        <h5 style="color:#8B0000">لم يجب التلميذ على السؤال الأخير</h5>
      </div>
    </div>
    <button v-if="results.length > 0" @click="removeAllResults">
      حذف كل الإختبارات
    </button>
  </main>
</template>

<style>
.cursor-pointer {
  cursor: pointer;
}

.correct {
  color: green;
}

.incorrect {
  color: red;
  text-decoration: line-through;
}

.questionnaire {
  background-color: #f9f9f9;
  /* Couleur de fond légère */
  border-radius: 10px;
  /* Bordures arrondies */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Ombre douce pour un effet de profondeur */
  padding: 20px;
  /* Espace interne pour éviter que le contenu touche directement les bords */
  margin: 20px 0;
  /* Assurez un peu d'espace autour du composant */
}

.questionnaire h3 {
  color: #333;
  /* Couleur plus foncée pour le titre pour assurer une bonne lisibilité */
  margin-bottom: 15px;
  /* Espace sous le titre */
}

.questionnaire p,
.questionnaire li {
  color: #555;
  /* Couleur douce pour le texte */
  line-height: 1.6;
  /* Espacement des lignes pour améliorer la lisibilité */
}

.questionnaire ul {
  list-style-type: none;
  /* Enlever les puces des listes */
  padding: 0;
  /* Enlever le padding par défaut des listes */
}

.questionnaire .correct {
  color: #38b000;
  /* Couleur verte pour les réponses correctes */
  font-weight: bold;
  /* Rendre le texte des réponses correctes plus gras */
}

.questionnaire .incorrect {
  color: #ff4d4d;
  /* Couleur rouge pour les réponses incorrectes */
  text-decoration: line-through;
  /* Barrer les réponses incorrectes */
}

.questionnaire li {
  margin-bottom: 10px;
  /* Espace entre les options de réponse */
}
</style>
