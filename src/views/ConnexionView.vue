<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import NavBar from "@/components/NavBarComponent.vue";

const credentials = ref({
  username: "",
  password: "",
});
const selectedChoice = ref(null);
const router = useRouter();

const login = () => {
  if (
    credentials.value.username === "eleve" &&
    credentials.value.password === "mdp" &&
    selectedChoice.value === "choix1"
  ) {
    localStorage.setItem("userStatus", "eleve_ok");
    router.push("/questionnaire-deploy/eleve");
  } else if (
    credentials.value.username === "parent" &&
    credentials.value.password === "mdp" &&
    selectedChoice.value === "choix2"
  ) {
    localStorage.setItem("userStatus", "parent_ok");
    router.push("/questionnaire-deploy/parent");
  } else {
    alert("لم تعطني معلومات صحيحة للدخول إلى صفحتك. عليها أن تكون صحيحة !!");
  }
};
</script>

<template>
  <header>
    <NavBar json_name="NavBarConnexionData.json" />
  </header>
  <main class="accueil-view flex-shrink-0 container mt-5">
    <h2>تسجيل</h2>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="username" class="form-label">البريد الإلكتروني</label>
        <input type="text" class="form-control" id="username" v-model="credentials.username" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">كلمة السر</label>
        <input type="password" class="form-control" id="password" v-model="credentials.password" required />
      </div>
      <div class="mb-3">
        <label class="form-label">هل أنت تلميذ ام وليّ ؟</label>
        <div class="form-check">
          <input type="radio" class="form-check-input" id="choix1" value="choix1" v-model="selectedChoice"
            name="choix" />
          <label class="form-check-label" for="choix1">تلميذ</label>
        </div>
        <div class="form-check">
          <input type="radio" class="form-check-input" id="choix2" value="choix2" v-model="selectedChoice"
            name="choix" />
          <label class="form-check-label" for="choix2">وليّ</label>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">تسجيل</button>
    </form>
  </main>
</template>
<style scoped>
.main {
  background: no-repeat center center fixed url("/path-to-your-background-image.jpg");
  background-size: cover;
  min-height: 100vh;
}

.accueil-view {
  padding: 4rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.form-control {
  border-radius: 0.5rem;
}

.form-check-label {
  font-size: 1.2rem;
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
}

h2 {
  color: #ff8c00;
  text-align: center;
  font-family: "Fredoka One", cursive;
}

/* Adaptation spécifique pour l'alerte */
.alert {
  font-size: 1.2rem;
  color: #d32f2f;
  padding: 1rem;
  margin-top: 1rem;
}
</style>
