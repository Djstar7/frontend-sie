import type { StatusAppt } from '@/types/appoitment'
import type { StatusPayment } from '@/types/payment'
import type { StatusMat } from '@/types/user'
import type { StatusVisa } from '@/types/visa'

const statusMap = new Map<StatusMat, string>([
  ['single', 'Célibataire'],
  ['married', 'Marié(e)'],
  ['divorced', 'Divorcé(e)'],
  ['widowed', 'Veuf(ve)'],
])

const iconClassMap = new Map<StatusMat, string>([
  ['single', 'fas fa-user'],
  ['married', 'fas fa-ring'],
  ['divorced', 'fas fa-person-circle-minus'],
  ['widowed', 'fas fa-person-circle-exclamation'],
])

const apptStatusMap = new Map<StatusAppt, string>([
  ['pending', 'En attente'],
  ['completed', 'Terminée'],
  ['rescheduled', 'Programée'],
  ['canceled', 'Annulée'],
])
const apptStatusColors = new Map<StatusAppt, string>([
  ['pending', 'bg-yellow-100 text-yellow-700'],
  ['completed', 'bg-green-100 text-green-700'],
  ['rescheduled', 'bg-blue-100 text-blue-700'],
  ['canceled', 'bg-red-100 text-red-700'],
])

const paymentStatusMap = new Map<StatusPayment, string>([
  ['completed', 'Payé'],
  ['pending', 'En attente'],
  ['failed', 'Echoué'],
  ['processing', 'Traitement en cours'],
  ['canceled', 'Annulé'],
  ['expired', 'Expiré'],
])
const paymentStatusColors = new Map<StatusPayment, string>([
  ['completed', 'bg-green-100 text-green-700'],
  ['pending', 'bg-yellow-100 text-yellow-700'],
  ['failed', 'bg-red-100 text-red-700'],
  ['processing', 'bg-blue-100 text-blue-700'],
  ['canceled', 'bg-gray-200 text-gray-500'],
  ['expired', 'bg-orange-100 text-orange-600'],
])

const visaRequestStatusMap = new Map<StatusVisa, string>([
  ['pending', 'En attente'],
  ['approved', 'Approuvé'],
  ['rejected', 'Refusé'],
  ['processing', 'Traitement en cours'],
  ['created', 'Crée'],
])
const visaRequestStatusColors = new Map<StatusVisa, string>([
  ['created', 'bg-blue-100 text-blue-600'],
  ['pending', 'bg-yellow-100 text-yellow-700'],
  ['processing', 'bg-purple-100 text-purple-600'],
  ['rejected', 'bg-red-100 text-red-700'],
  ['approved', 'bg-green-100 text-green-700'],
])
export {
  statusMap,
  iconClassMap,
  apptStatusMap,
  apptStatusColors,
  paymentStatusMap,
  paymentStatusColors,
  visaRequestStatusMap,
  visaRequestStatusColors,
}
