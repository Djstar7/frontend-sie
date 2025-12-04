<script setup lang="ts">
import LogoSection from '@/components/LogoSection.vue'
// Assurez-vous d'importer le composant de LogoSection s'il est utilisé
</script>

<template>
  <div class="min-h-screen flex flex-col md:grid md:grid-cols-2 bg-gray-50">
    <div
      class="h-[35vh] md:h-auto bg-gradient-to-br from-blue-700 via-purple-700 to-red-600 flex items-center justify-center p-6 md:p-12 famille relative overflow-hidden"
    >
      <div
        class="absolute inset-0 opacity-10 bg-white/10 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]"
      ></div>

      <div class="text-center text-white max-w-lg relative z-10">
        <h1
          class="text-3xl md:text-5xl font-extrabold mb-3 md:mb-5 tracking-wide drop-shadow-xl /* Tailwind drop-shadow */"
        >
          Service Immigration de l'Estuaire
        </h1>

        <p class="text-lg md:text-xl opacity-95 italic font-light text-shadow-custom">
          Votre porte d'entrée simplifiée vers le monde. Commencez vos démarches sans attendre.
        </p>
      </div>
    </div>

    <div
      class="flex-1 h-[65vh] md:h-auto rounded-t-3xl md:rounded-none flex flex-col items-center justify-between py-8"
    >
      <div class="w-full flex justify-center pt-4 pb-6">
        <img
          src="@/assets/images/logo.png"
          alt="Logo SIE"
          class="h-20 w-20 mx-auto drop-shadow-xl"
        />
      </div>

      <div class="flex-1 w-full flex justify-center items-start px-6 sm:px-10 overflow-y-auto">
        <div class="w-full md:w-3/4 lg:w-2/3 max-w-lg">
          <router-view />
          <LogoSection class="mt-8" />
        </div>
      </div>

      <div class="w-full mt-10 px-6 sm:px-10 pb-4 text-center">
        <router-link
          :to="{ name: 'home' }"
          class="text-purple-600 hover:text-red-500 font-semibold transition-colors duration-300 text-base md:text-lg inline-flex items-center"
        >
          <i class="fa-solid fa-house mr-2"></i>Retour à l'accueil
        </router-link>
      </div>

      <footer class="py-4 text-center text-gray-500 text-xs mt-4 border-t border-gray-100 w-full">
        &copy; {{ new Date().getFullYear() }} Service Immigration Estuaire. Tous droits réservés.
      </footer>
    </div>
  </div>
</template>

<style>
/* Maintenu pour la cohérence visuelle, assurez-vous que l'image existe */
.famille {
  background: url('@/assets/images/banners/famille.png') 0% no-repeat;
  background-size: cover;
  background-position: center;
}

/* 💡 Ajout de la classe personnalisée pour un Text Shadow qui garantit la lisibilité */
/* Cette ombre crée un léger contour noir autour du texte blanc. */
.text-shadow-custom {
  text-shadow:
    2px 2px 3px rgba(0, 0, 0, 0.7),
    -2px -2px 3px rgba(0, 0, 0, 0.7);
}

/* Vous pouvez également utiliser le même Text Shadow pour le titre si le drop-shadow de Tailwind ne suffit pas */
/* Exemple :
.drop-shadow-xl {
    filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.2)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.1));
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}
*/
</style>
