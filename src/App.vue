<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AccueilView from "./views/AccueilView.vue";
import ParentView from "./views/ParentView.vue";
import EleveView from "./views/EleveView.vue";
import ConnexionView from "./views/ConnexionView.vue";

const route = useRoute();
const viewsMapping = {
  "الصفحة الرّئيسية": AccueilView,
  وليّ: ParentView,
  تلميذ: EleveView,
  تسجيل: ConnexionView,
};
const currentView = computed(() => viewsMapping[route.name]);
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <component :is="currentView"></component>
    <footer class="mt-auto bg-light fixed-bottom">
      <div class="d-flex justify-content-center p-1">
        <p class="text-muted mb-0">© 2024 Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
