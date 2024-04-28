<script setup>
import { ref, onMounted } from "vue";
import JsPDF from "jspdf";
import html2canvas from "html2canvas";
import correctSound from "@/audio/success.mp3";
import incorrectSound from "@/audio/failure.mp3";
import congratsSound from "@/audio/congrats.mp3";
import canDoBetterSound from "@/audio/canDoBetter.mp3";
import failureSound from "@/audio/failureResult.mp3";


const props = defineProps({
  jsonName: String,
});

const questions = ref([]);
const selectedAnswers = ref({});
const isSubmitted = ref(false);
const titre = ref("");
const responseGiven = ref({});
const score = ref(0);
const scorePercentage = ref(0);
const resultGif = ref("");
const fullName = ref('');
const inputText = ref('');

const fetchQuestions = async () => {
  const module = await import(`@/data/${props.jsonName}.json`);
  questions.value = module.questions.map((question, index) => ({
    ...question,
    uniqueId: `${question.id}-${index}` // Crée un identifiant unique en combinant l'ID de catégorie et l'index
  }));
  questions.value.forEach((_, index) => {
    responseGiven.value[index] = false;
  });
  titre.value = module.titre
};

onMounted(fetchQuestions);

const updateResultGif = () => {
  if (scorePercentage.value >= 80) {
    resultGif.value = "@/gifs/congrats.gif";
  } else if (scorePercentage.value >= 50) {
    resultGif.value = "@/gifs/canDoBetter.png";
  } else {
    resultGif.value = "@/gifs/failure.gif";
  }
};

const calculateScore = () => {
  let correctAnswers = 0;
  questions.value.forEach((question) => {
    if (selectedAnswers.value[question.uniqueId] === question.correct_response) {
      correctAnswers++; // Incrémenter pour chaque réponse correcte
    }
  });
  score.value = correctAnswers;
  scorePercentage.value = Math.round(
    (correctAnswers / questions.value.length) * 100
  ); // Calculer le pourcentage de bonnes réponses
  playResultSound(); // Jouer un son basé sur le score
  updateResultGif(); // Mettre à jour le GIF basé sur le score
  return score.value; // Retourner le score pour d'autres utilisations éventuelles
};


const playResultSound = () => {
  let soundPath;
  if (scorePercentage.value < 50) {
    soundPath = failureSound;
  } else if (scorePercentage.value < 80) {
    soundPath = canDoBetterSound; // Chemin du son pour 50-69%
  } else {
    soundPath = congratsSound; // Chemin du son pour >=70%
  }
  const audio = new Audio(soundPath);
  audio.play();
};

// Fonction pour télécharger le PDF
const downloadPdf = async () => {
  const doc = new JsPDF();
  const element = document.getElementById("questionnaire");

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  // Ajouter l'image au document PDF
  doc.addImage(imgData, "PNG", 1, 1);

  // Télécharger le PDF
  doc.save("resultats-questionnaire.pdf");
};

const submitAnswers = () => {
  console.log(inputText.value)
  isSubmitted.value = true;
  const finalScore = calculateScore(selectedAnswers.value, questions.value);
  const resultData = {
    childName: fullName.value,
    storyName: titre.value,
    answers: selectedAnswers.value,
    score: finalScore,
    questions: questions.value,
    responseText: inputText.value,
  };

  const resultId = `result-${Date.now()}-${props.jsonName}`;
  localStorage.setItem(resultId, JSON.stringify(resultData));
};

const handleOptionChange = (question, option) => {
  selectedAnswers.value[question.uniqueId] = option;
  responseGiven.value[question.uniqueId] = true; // Marquer la réponse comme donnée
  console.log(question.correct_response); // Log de la réponse correcte pour débogage
  playSound(option === question.correct_response); // Jouer le son selon la correction de la réponse
};

const playSound = (isCorrect) => {
  const audio = new Audio(isCorrect ? correctSound : incorrectSound);
  audio.play();
};

const selectOption = (question, option) => {
  console.log("option donnée : ", option); // Log de l'option choisie pour débogage
  handleOptionChange(question, option); // Appel de la méthode existante qui gère la validation
};


</script>
<template>
  <div class="questionnaire p-2">
    <label for="name">الإسم و اللقب</label><br>
    <input class="mb-2" type="text" v-model="fullName">
    <h4 class="fw-bold mb-5">
      إختر الإجابة الصحيحة لكلّ سؤال. الإختيار نهائي, فلا تتعجل. إن مع التّأنّي
      السلامة و مع العجلة الندامة😉
    </h4>
    <form @submit.prevent="submitAnswers">
      <div v-for="question in questions" :key="question.uniqueId" class="mb-3">
        <template v-if="question.id === 1">
          <div class="fw-bold">
            <h4>{{ question.question }}</h4>
          </div>
          <div v-for="(option, i) in question.options" :key="i" class="form-check">
            <input type="radio" class="form-check-input" :id="`question_${question.uniqueId}_option_${i}`"
              :name="`question_${question.uniqueId}`" :value="option" :disabled="responseGiven[question.uniqueId]"
              v-model="selectedAnswers[question.uniqueId]" @change="handleOptionChange(question, option)" />
            <label class="form-check-label" :for="`question_${question.uniqueId}_option_${i}`">{{ option }}</label>
            <!-- Icones de réponse juste ou fausse -->
            <span v-if="responseGiven[question.uniqueId]" :class="{
      'text-success': option === question.correct_response,
      'text-danger':
        selectedAnswers[question.uniqueId] === option &&
        option !== question.correct_response,
    }">
              <template v-if="option === question.correct_response">✓</template>
              <template v-if="selectedAnswers[question.uniqueId] === option &&
      option !== question.correct_response">✗</template>
            </span>
          </div>
        </template>

        <template v-if="question.id ===2">
          <div class="fw-bold">
            <h4>{{ question.question }}</h4>
          </div>
          <!-- Bouton pour la réponse choisie, devient rouge si la réponse est incorrecte -->
          <button v-if="responseGiven[question.uniqueId]" class="btn"
            :class="{ 'btn-success btn-lg mx-1': selectedAnswers[question.uniqueId] === question.correct_response, 'btn-danger btn-lg mx-1': selectedAnswers[question.uniqueId] !== question.correct_response }">
            {{ selectedAnswers[question.uniqueId] }}
          </button>
          <!-- Si la réponse donnée est incorrecte, montrer le bouton de la bonne réponse en vert -->
          <button
            v-if="responseGiven[question.uniqueId] && selectedAnswers[question.uniqueId] !== question.correct_response"
            class="btn btn-success btn-lg mx-1">
            {{ question.correct_response }}
          </button>
          <!-- Les boutons pour choisir une option, visibles uniquement avant qu'une réponse ne soit donnée -->
          <div class="btn-group mt-2" v-if="!responseGiven[question.uniqueId]">
            <button v-for="option in question.options" :key="option" class="btn btn-primary btn-lg mx-1" style="--bs-btn-font-weight: 600;"
              @click="selectOption(question, option)">
              {{ option }}
            </button>
          </div>
        </template>
        </div>
        <div class="mb-3">
          <h5>إقترح نهاية جديدة لقصة : {{ titre }}</h5>
          <textarea style="color:var(--bs-black);" v-model="inputText" rows="4" cols="50"></textarea>
        </div>
        <div class="text-center mt-3">
          <button type="submit" class="btn btn-primary" v-if="!isSubmitted">
            أرسل الإجابات
          </button>
        </div>
    </form>
    <div v-if="isSubmitted" class="result-animation">
      <img v-if="scorePercentage < 50" src="@/gifs/failure.gif" alt="Result Animation Failure" />
      <img v-if="scorePercentage >= 50 && scorePercentage < 80" src="@/gifs/canDoBetter.png"
        alt="Result Animation Can Do Better" />
      <img v-if="scorePercentage >= 80" src="@/gifs/congrats.gif" alt="Result Animation Congrats" />
    </div>
    <div class="mt-3 text-center" v-if="isSubmitted">
      <p class="fw-bold display-6">
        نتيجتك: {{ score }}/{{ questions.length }} ({{ scorePercentage }}%)
      </p>
      <p class="fw-bold display-6" v-if="scorePercentage < 50">
        عليك قراءة القصة مرة أخرى😞ولا تيأس فستنجح في المرّة القادمة!
      </p>
      <p class="fw-bold display-6" v-if="scorePercentage >= 50 && scorePercentage < 80">
        جيد😊 لكن يمكنك القيام بمجهود أكبر!
      </p>
      <p class="fw-bold display-6" v-if="scorePercentage >= 80">
        ممتاز جدّا😃 لقد نجحت بتفوق!
      </p>
    </div>
    <button v-if="isSubmitted" @click="downloadPdf">تحميل النتائج</button>
  </div>
</template>

<style scoped>
.questionnaire {
  direction: rtl;
  font-family: "Cairo", sans-serif;
}

.mb-3 {
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.form-check {
  text-align: right;
  margin-top: 10px;
}

.form-check-input {
  margin-right: 10px;
  cursor: pointer;
}

.form-check-label {
  display: inline-block;
  width: calc(100% - 30px);
}

.text-success,
.text-danger {
  font-weight: bold;
}

.correct-response {
  color: #28a745;
  margin-top: 10px;
}

.text-center {
  text-align: center;
}

.mt-3.text-center {
  margin-top: 30px;
}

.fw-bold {
  font-weight: bold;
}


textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fafafa;
  resize: vertical;
  font-family: Arial, sans-serif;
}





.answers {
  display: flex;
  margin-bottom: 10px;
}


.answer-slot {
  width: 200px;
  min-height: 30px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.draggable-answer {
  padding: 5px 10px;
  margin-right: 5px;
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  cursor: pointer;
}
</style>
