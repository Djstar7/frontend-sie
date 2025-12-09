<template>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="company-info">
        <h1 class="logo">VISA SERVICE PRO</h1>
        <p>123, Rue des Voyages, Ville, Pays</p>
        <p>Email: contact@visaservicepro.com | Tél: +123 456 7890</p>
      </div>
      <div class="invoice-meta">
        <h2>FACTURE</h2>
        <p>
          **Nº de Facture :**
          <span class="highlight">{{ receipt.id }}</span>
        </p>
        <p>
          **Date d'Émission :**
          <span>{{ formattedCreationDate }}</span>
        </p>
      </div>
    </div>

    <hr class="separator" />

    <div class="section client-info">
      <h3>Informations Client (Facturé à)</h3>
      <div class="client-details">
        <p>
          **Nom :**
          {{ receipt.profil.first_name }} {{ receipt.profil.last_name }}
        </p>
        <p>
          **Email :**
          {{ receipt.user.email || 'Non spécifié' }}
        </p>
        <p>
          **Téléphone :**
          {{ receipt.profil.phone || 'Non spécifié' }}
        </p>
        <p>
          **Nom d'utilisateur :**
          {{ receipt.user.name || 'Non spécifié' }}
        </p>
      </div>
    </div>

    <div class="section service-details">
      <h3>Détails du Service (Demande de Visa)</h3>
      <table>
        <tr>
          <td>**Type de Visa :**</td>
          <td>{{ receipt.visa_request.visa_type_name || 'N/A' }}</td>
        </tr>
        <tr>
          <td>**Pays de Départ :**</td>
          <td>{{ receipt.visa_request.country_origin_name || 'N/A' }}</td>
        </tr>
        <tr>
          <td>**Pays de Destination :**</td>
          <td>{{ receipt.visa_request.country_dest_name || 'N/A' }}</td>
        </tr>
        <tr>
          <td>**ID de la Demande :**</td>
          <td>{{ receipt.payment.id }}</td>
        </tr>
      </table>
    </div>

    <hr class="separator" />

    <div class="section payment-items">
      <h3>Détails du Paiement</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Description de l'Article</th>
            <th class="align-center">Méthode de Paiement</th>
            <th class="align-center">ID Transaction</th>
            <th class="align-right">Statut</th>
            <th class="align-right">Montant</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Frais de traitement pour Visa ({{ receipt.visa_request.visa_type_name || 'Général' }})
            </td>
            <td class="align-center">{{ formatMethod(receipt.payment.method) }}</td>
            <td class="align-center">{{ receipt.payment.transaction_id }}</td>
            <td :class="['align-right', 'status', receipt.payment.status]">
              {{ formatStatus(receipt.payment.status) }}
            </td>
            <td class="align-right amount-cell">
              **{{ formatAmount(receipt.payment.amount, receipt.payment.currency) }}**
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="total-section">
      <div class="total-line subtotal">
        <span class="label">Sous-Total :</span>
        <span class="value">{{
          formatAmount(receipt.payment.amount, receipt.payment.currency)
        }}</span>
      </div>
      <div class="total-line tax">
        <span class="label">Taxes (0%) :</span>
        <span class="value">{{ formatAmount(0, receipt.payment.currency) }}</span>
      </div>
      <div class="total-line grand-total">
        <span class="label">**TOTAL PAYÉ :**</span>
        <span class="value">
          **{{ formatAmount(receipt.payment.amount, receipt.payment.currency) }}**
        </span>
      </div>
    </div>

    <hr class="separator" />

    <div class="invoice-footer">
      <p class="thanks">**Merci pour votre commande !**</p>
      <p>
        Ceci est la confirmation de votre paiement. Veuillez noter que la réception de ce paiement
        ne garantit pas l'approbation du visa.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// --- Types TypeScript de l'interface fournie ---
interface Receipt {
  id: string
  file_path: string
  payment: {
    id: string
    amount: number
    transaction_id: string
    method: string
    currency: string
    status: string
  }
  visa_request: {
    visa_type_name: string | null
    country_origin_name: string | null
    country_dest_name: string | null
  }
  user: {
    name: string | null
    email: string | null
  }
  profil: {
    first_name: string | null
    last_name: string | null
    phone: string | null
  }
  created_at: string
  updated_at: string
}

// Définition des props
const props = defineProps<{
  receipt: Receipt
}>()

// --- Fonctions de Formatage ---

// Formatage de la date de création
const formattedCreationDate = computed(() => {
  if (props.receipt.created_at) {
    return new Date(props.receipt.created_at).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  return 'N/A'
})

// Formatage du montant avec la devise
const formatAmount = (amount: number | string, currency: string): string => {
  const numAmount = Number(amount)
  // Utilise try/catch car 'currency' pourrait ne pas être standard
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(numAmount)
  } catch (e) {
    console.error(`Erreur lors du formatage du montant : ${e}`)
    return `${numAmount.toFixed(2)} ${currency.toUpperCase()}`
  }
}

// Traduction et formatage des méthodes de paiement
const formatMethod = (method: string): string => {
  const methods: { [key: string]: string } = {
    mtn: 'MTN Mobile Money',
    orange: 'Orange Money',
    visa: 'Carte Bancaire (VISA)',
    paypal: 'PayPal',
  }
  // Retourne la traduction si elle existe, sinon capitalise la première lettre
  return (
    methods[method.toLowerCase()] || method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()
  )
}

// Traduction et formatage des statuts de paiement
const formatStatus = (status: string): string => {
  const statuses: { [key: string]: string } = {
    completed: 'TERMINÉ',
    pending: 'EN ATTENTE',
    failed: 'ÉCHOUÉ',
    processing: 'EN COURS',
    canceled: 'ANNULÉ',
    expired: 'EXPIRÉ',
  }
  return statuses[status.toLowerCase()] || status.toUpperCase()
}
</script>

<style scoped>
/* Conteneur principal */
.invoice-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #fff;
}

/* En-tête de la facture */
.invoice-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.logo {
  font-size: 28px;
  font-weight: 900;
  color: #007bff; /* Bleu typique pour les services */
  margin-bottom: 5px;
}

.company-info p {
  margin: 2px 0;
  font-size: 13px;
  color: #555;
}

.invoice-meta h2 {
  font-size: 32px;
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
}

.invoice-meta p {
  margin: 5px 0;
  font-size: 14px;
}

.highlight {
  font-weight: bold;
  color: #007bff;
}

/* Séparateur */
.separator {
  border: 0;
  height: 1px;
  background: #eee;
  margin: 30px 0;
}

/* Sections générales */
.section h3 {
  border-bottom: 3px solid #f0f0f0;
  padding-bottom: 8px;
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

/* Infos Client/Service */
.client-details p,
.service-details table td {
  font-size: 14px;
  line-height: 1.6;
}

.service-details table {
  width: 100%;
  border-collapse: collapse;
}

.service-details table td {
  padding: 5px 0;
}

.service-details table td:first-child {
  width: 35%;
  font-weight: bold;
  color: #555;
}

/* Tableau des articles */
.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th,
.items-table td {
  border: 1px solid #f0f0f0;
  padding: 12px 15px;
}

.items-table th {
  background-color: #007bff;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
}

.items-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.amount-cell {
  font-size: 16px;
  color: #28a745; /* Vert pour le montant */
}

/* Alignements */
.align-right {
  text-align: right;
}

.align-center {
  text-align: center;
}

/* Section Totaux */
.total-section {
  margin-top: 30px;
  text-align: right;
  width: 100%;
}

.total-line {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  font-size: 15px;
}

.total-line .label {
  width: 150px;
  text-align: left;
  margin-right: 20px;
  color: #555;
}

.total-line .value {
  width: 150px;
  font-weight: 600;
}

.grand-total {
  font-size: 18px;
  color: #000;
  border-top: 2px solid #007bff;
  padding-top: 10px;
  margin-top: 10px;
}

/* Pied de page */
.invoice-footer {
  margin-top: 40px;
  text-align: center;
  font-size: 13px;
  color: #777;
}

.thanks {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

/* Classes pour les statuts */
.status {
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
  font-size: 11px;
}

.status.completed {
  background-color: #d4edda;
  color: #155724;
}
.status.pending,
.status.processing {
  background-color: #fff3cd;
  color: #856404;
}
.status.failed,
.status.canceled,
.status.expired {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
