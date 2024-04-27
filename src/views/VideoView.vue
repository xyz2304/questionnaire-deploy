<script setup>
import NavBar from '@/components/NavBarComponent.vue'
</script>
<template>
    <header>
        <NavBar json_name="NavBarConnexionData.json" />
    </header>
    <main class="accueil-view flex-shrink-0">
        <div class="text-center bg-light p-5 mb-4 shadow-sm">
            <h1 class="mb-3">إضغط لتشاهد الفيديو</h1>
        </div>
        <div>
            <video controls>
                <source src="/public/assets/videos/donaldStory.mp4" type="video/mp4" />
            </video>
        </div>
    </main>
</template>
<style></style>