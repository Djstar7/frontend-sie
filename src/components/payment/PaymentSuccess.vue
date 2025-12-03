<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-orange-400 text-white"
  >
    <div class="bg-white shadow-2xl rounded-2xl p-8 text-center max-w-md w-full">
      <div class="flex justify-center mb-6">
        <i class="fa fa-check-circle text-green-500 text-6xl"></i>
      </div>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Paiement Réussi</h1>
      <p class="text-gray-600 mb-6">
        Merci ! Votre transaction a été validée avec succès. Vous recevrez une confirmation par
        email.
      </p>
      <router-link
        :to="{ name: 'home' }"
        href="/"
        class="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md transition-all"
      >
        <i class="fa fa-home"></i> Retour à l'accueil
      </router-link>
    </div>
  </div>
</template>
