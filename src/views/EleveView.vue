<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import NavBar from "@/components/NavBarComponent.vue";
import QuestionnaireComponent from "@/components/QuestionnaireComponent.vue";
import ColoriageComponent from "@/components/ColoriageComponent.vue";
const router = useRouter();

const videoOpen = ref(false);
const togglevideo = () => {
  videoOpen.value = !videoOpen.value
}
// Vérification de l'autorisation de l'utilisateur
const userStatus = localStorage.getItem("userStatus");
if (!userStatus || userStatus !== "eleve_ok") {
  router.push("/questionnaire-deploy/connexion");
}

// Déclaration et initialisation des questionnaires
const questionnaires = ref([
  {
    name: "بطوط يبحث عن مهنة",
    json: "questionsDonaldData",
    image: "assets/donald.webp",
    selected: false,
    video: true
  },
  {
    name: "حلم فراشة",
    json: "questionsPapillonData",
    image: "assets/papillon.jpg",
    selected: false,
    video: false
  },
]);

const selectedColoriage = ref("");

// Fonction pour sélectionner un questionnaire
const selectQuestionnaire = (jsonName) => {
  questionnaires.value.forEach((questionnaire) => {
    questionnaire.selected = questionnaire.json === jsonName;
  });
};

const selectColoriageQuestions = (jsonName, imagePath) => {
  selectQuestionnaire(jsonName);
  selectedColoriage.value = imagePath;
};
</script>

<template>
  <header>
    <NavBar json_name="NavBarEleveData.json" />
  </header>
  <main class="flex-shrink-0 container mt-5">
    <div class="row">
      <div class="col-md-6 mb-4" v-for="questionnaire in questionnaires" :key="questionnaire.name">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              {{ `أسئلة القصة ${questionnaire.name}` }}
            </h5>
            <button @click="
        selectColoriageQuestions(
          questionnaire.json,
          questionnaire.image
        )
        ">
              أنقر لتبدأ الإجابة عن الأسئلة
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-for="questionnaire in questionnaires" :key="`details-${questionnaire.json}`">
      <div v-if="questionnaire.video" >
        <button v-if="!videoOpen" class="btn btn-secondary" @click="togglevideo">مشاهدة فيديو قصة بطوط يبحث عن مهنة</button>
        <button v-if="videoOpen" class="btn btn-secondary" @click="togglevideo">إغلاق
          الفيديو</button>
        <video v-if="videoOpen" controls>
          <source src="/public/assets/videos/donaldStory.mp4" type="video/mp4" />
        </video>
      </div>
      <QuestionnaireComponent id="questionnaire" v-if="questionnaire.selected" :json-name="questionnaire.json"
        class="questionnaire-display" />
      <ColoriageComponent v-if="selectedColoriage && questionnaire.selected" :image-path="selectedColoriage" />
    </div>
  </main>
</template>

<style scoped>
.questionnaire-display {
  margin-top: 2rem;
  padding: 2rem;
  border-top: 3px dashed #06052f;
  background-color: #f0f9ff;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  overflow-x: hidden;
}

/* Styles pour la card */
.card {
  cursor: pointer;
  transition: transform 0.3s ease;
  border-radius: 15px;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

/* Styles pour le titre de la card */
.card-title {
  color: #5cacee;
  font-family: "Fredoka One", cursive;
}

/* Styles pour le texte de la card */
.card-text {
  color: #333;
}
</style>
