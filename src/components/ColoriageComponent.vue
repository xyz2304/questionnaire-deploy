<script setup>
import { ref, onMounted } from 'vue';

const paintCanvas = ref(null);
const ctx = ref(null);
const painting = ref(false);
const color = ref('#000000');
const brushSize = ref(5);
const canvasWidth = ref(800);
const canvasHeight = ref(600);
const image = new Image();

const props = defineProps({
  imagePath: String
});
const imagePath = ref('');



// Fonction pour charger et redimensionner l'image
const loadImage = () => {
  imagePath.value = props.imagePath;
  image.src = imagePath.value;
  image.onload = () => {
    const scale = Math.min(canvasWidth.value / image.width, canvasHeight.value / image.height);
    const x = (canvasWidth.value / 2) - (image.width / 2) * scale;
    const y = (canvasHeight.value / 2) - (image.height / 2) * scale;
    ctx.value.drawImage(image, x, y, image.width * scale, image.height * scale);
  };
};

// Initialiser le canvas
const setupCanvas = () => {
  ctx.value = paintCanvas.value.getContext('2d');
  loadImage();
};

const startPainting = (event) => {
  painting.value = true;
  paint(event);
};

const endPainting = () => {
  painting.value = false;
  ctx.value.beginPath();
};

// Fonction pour dessiner sur le canvas
const paint = (event) => {
  if (!painting.value) return;
  ctx.value.lineWidth = brushSize.value;
  ctx.value.lineCap = 'round';
  ctx.value.strokeStyle = color.value;

  const rect = paintCanvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  ctx.value.lineTo(x, y);
  ctx.value.stroke();
  ctx.value.beginPath();
  ctx.value.moveTo(x, y);
};

// Effacer les dessins tout en conservant l'image de fond
const clearCanvas = () => {
  ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
  loadImage();
};

onMounted(setupCanvas);
</script>
<template>
  <h4>😉لنلوّن مع بعض هذه الصورة</h4>
  <div class="paint-container">
    <canvas ref="paintCanvas" :width="canvasWidth" :height="canvasHeight" @mousedown="startPainting" @mousemove="paint"
      @mouseup="endPainting" @mouseleave="endPainting"></canvas>
    <div class="controls">
      <input type="color" v-model="color" />
      <input type="range" v-model="brushSize" min="1" max="50" />
      <button @click="clearCanvas">حذف</button>
    </div>
  </div>
</template>
<style scoped>
.paint-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

canvas {
  border: 1px solid black;
  margin-bottom: 10px;
  background-color: white;
}

.controls {
  display: flex;
  gap: 10px;
}

.controls input[type="range"] {
  width: 100px;
}
</style>