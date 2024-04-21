<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import dataAccueil from "@/data/NavBarAccueilData.json";
import dataConnexion from "@/data/NavBarConnexionData.json";
import dataEleve from "@/data/NavBarEleveData.json";
import dataParent from "@/data/NavBarParentData.json";

const dataFiles = {
  "NavBarAccueilData.json": dataAccueil,
  "NavBarConnexionData.json": dataConnexion,
  "NavBarEleveData.json": dataEleve,
  "NavBarParentData.json": dataParent,
};
const show = ref(false)
const props = defineProps<{
  /*
   * Nom du json a partir duquel on extrait les items
   */
  json_name: string;
}>();
const router = useRouter();
const data = ref(null);
onMounted(async () => {
  if (props.json_name) {
    try {
      const dataName = props.json_name;
      const module = dataFiles[dataName];
      data.value = module;
    } catch (error) {
      console.error("Failed to load JSON data:", error);
    }
  }
});

const handleAction = (item) => {
  if (item.action === "logout") {
    localStorage.removeItem("userStatus");
    router.push("/questionnaire-deploy/connexion");
  }
};
</script>
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">استطلاع القراءة</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        @click="show = !show"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav" :class="{'show': show==true}">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-for="item in data" :key="item.id">
            <router-link
              :to="item.id"
              class="nav-link"
              @click.prevent="handleAction(item)"
            >
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<style scoped></style>
