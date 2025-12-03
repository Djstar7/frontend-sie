<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-500 via-purple-600 to-orange-400 text-white"
  >
    <div class="bg-white shadow-2xl rounded-2xl p-8 text-center max-w-md w-full">
      <div class="flex justify-center mb-6">
        <i class="fa fa-times-circle text-red-500 text-6xl"></i>
      </div>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Paiement Échoué</h1>
      <p class="text-gray-600 mb-6">
        Oups , la transaction n’a pas pu être complétée. Veuillez réessayer ou utiliser une autre
        méthode de paiement.
      </p>
      <div class="flex flex-col gap-3">
        <router-link
          :to="{ name: 'custom.payment.store' }"
          class="inline-flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-xl shadow-md transition-all"
        >
          <i class="fa fa-redo"></i> Réessayer
        </router-link>
        <router-link
          :to="{ name: 'home' }"
          class="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl shadow-md transition-all"
        >
          <i class="fa fa-home"></i> Retour à l'accueil
        </router-link>
      </div>
    </div>
  </div>
</template>
