<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const credentials = ref({
  username: "",
  password: "",
});

const router = useRouter();

const login = () => {
  console.log("Tentative de connexion avec", credentials.value);
};
</script>

<template>
  <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">تسجيل</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="username" class="form-label">البريد الإلكتروني</label>
              <input type="text" class="form-control" id="username" v-model="credentials.username" required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">كلمة السر</label>
              <input type="password" class="form-control" id="password" v-model="credentials.password" required />
            </div>

            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">
              تسجيل
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
