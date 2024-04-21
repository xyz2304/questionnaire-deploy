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
  questions.value = module.questions;
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
  questions.value.forEach((question, index) => {
    if (selectedAnswers.value[index] === question.correct_response) {
      correctAnswers++;
    }
  });
  score.value = correctAnswers;
  scorePercentage.value = Math.round(
    (correctAnswers / questions.value.length) * 100
  );
  playResultSound();
  updateResultGif();
  return score.value
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

const handleOptionChange = (index, option) => {
  selectedAnswers.value[index] = option;
  responseGiven.value[index] = true; // Marquer la réponse comme donnée
  // Jouer son selon la correction de la réponse
  playSound(option === questions.value[index].correct_response);
};
const playSound = (isCorrect) => {
  const audio = new Audio(isCorrect ? correctSound : incorrectSound);
  audio.play();
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
      <div v-for="(question, index) in questions" :key="index" class="mb-3">
        <div class="fw-bold"><h4>{{ question.question }}</h4></div>
        <div v-for="(option, i) in question.options" :key="i" class="form-check">
          <input type="radio" class="form-check-input" :id="`question_${index}_option_${i}`" :name="`question_${index}`"
            :value="option" :disabled="responseGiven[index]" v-model="selectedAnswers[index]"
            @change="handleOptionChange(index, option)" />
          <label class="form-check-label" :for="`question_${index}_option_${i}`">{{ option }}</label>
          <!-- Icones de réponse juste ou fausse -->
          <span v-if="responseGiven[index]" :class="{
      'text-success': option === question.correct_response,
      'text-danger':
        selectedAnswers[index] === option &&
        option !== question.correct_response,
    }">
            <template v-if="option === question.correct_response">✓</template>
            <template v-if="selectedAnswers[index] === option &&
      option !== question.correct_response
      ">✗</template>
          </span>
        </div>
      </div>
      <div class="mb-3">
        <h5>إقترح نهاية جديدة لقصة : {{ titre }}</h5>
        <textarea v-model="inputText" rows="4" cols="50"></textarea>
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

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
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
</style>
