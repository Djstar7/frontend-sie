// composables/usePayment.ts
import { computed } from 'vue'
import { paymentService } from '@/services/paymentService'
import type { PaymentSend, Payment, StatusPayment } from '@/types/payment'
import { toastSuccess } from '@/utils/toastConfig'
import { useLoading } from '@/utils/startLoading'

export function usePaymentStore() {
  const loading = useLoading()
  const payments: Payment[] = []

  interface Activity {
    id: number
    user: string
    type: string
    description: string
    date: string
  }

  const completedPaymentsCount = computed(
    () => payments.filter((p) => p.status === 'completed').length,
  )

  const failedPaymentsCount = computed(() => payments.filter((p) => p.status === 'failed').length)

  const totalRevenue = computed(() =>
    payments
      .filter((p) => p.status === 'completed')
      .reduce(
        (sum, p) => sum + (typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount || 0),
        0,
      ),
  )

  const recentActivities = computed<Activity[]>(() => {
    return payments
      .map((p, index) => {
        const amount = typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount || 0
        return {
          id: index + 1,
          user: `Utilisateur ${p.visa_request_id || 'inconnu'}`,
          type: 'paiement',
          description:
            p.status === 'completed'
              ? `Paiement de ${amount} ${p.currency} effectué`
              : `Paiement de ${amount} ${p.currency} ${p.status}`,
          date: p.created_at || new Date().toISOString(),
        }
      })
      .slice(0, 3)
  })

  const getPayments = async () => {
    loading.startLoading('Chargement des paiements en cours...')
    try {
      const response = await paymentService.getPayments()
      // payments.splice(0, payments.length, ...(response.payments || []))
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }
  const showPaymentByUser = async (id: string) => {
    loading.startLoading('Chargement des paiements en cours...')
    try {
      const response = await paymentService.showPaymentByUser(id)
      // payments.splice(0, payments.length, ...(response.payments || []))
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const createPayment = async (PaymentData: PaymentSend) => {
    loading.startLoading('Création du paiement en cours...')
    try {
      const response = await paymentService.createPayment(PaymentData)
      // payments.push(response)
      toastSuccess(response.message || 'Paiement créé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec lors de la création')
    } finally {
      loading.stopLoading()
    }
  }

  const showPayment = async (id: string) => {
    loading.startLoading('Chargement du paiement en cours...')
    try {
      return await paymentService.showPayment(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const showPaymentByCustom = async (id: string) => {
    loading.startLoading("Chargement des paiements d'un utilisateur en cours...")
    try {
      return await paymentService.showPaymentByUser(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const showPaymentByVisaRequest = async (id: string) => {
    loading.startLoading('Chargement des paiements pour la demande en cours...')
    try {
      return await paymentService.showPaymentByVisaRequest(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const editPayment = async (id: string, status: StatusPayment) => {
    loading.startLoading('Mise à jour du paiement en cours...')
    try {
      const response = await paymentService.editPayment(id, status)
      // const index = payments.findIndex(p => p.id === id)
      // if (index !== -1) payments[index] = response
      toastSuccess(response.message || 'Paiement mis à jour avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la mise à jour')
    } finally {
      loading.stopLoading()
    }
  }

  const editPaymentByUser = async (id: string, PaymentData: PaymentSend) => {
    loading.startLoading('Mise à jour du paiement par l’utilisateur en cours...')
    try {
      return await paymentService.editPaymentByUser(id, PaymentData)
    } catch (err) {
      loading.handleError(err, 'Échec de la mise à jour')
    } finally {
      loading.stopLoading()
    }
  }

  const deletePayment = async (id: string) => {
    loading.startLoading('Suppression du paiement en cours...')
    try {
      const response = await paymentService.deletePayment(id)
      const index = payments.findIndex((p) => p.id === id)
      if (index !== -1) payments.splice(index, 1)
      toastSuccess(response.message || 'Paiement supprimé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la suppression')
    } finally {
      loading.stopLoading()
    }
  }

  return {
    payments,
    completedPaymentsCount,
    failedPaymentsCount,
    totalRevenue,
    recentActivities,
    getPayments,
    createPayment,
    showPayment,
    showPaymentByCustom,
    showPaymentByVisaRequest,
    editPayment,
    showPaymentByUser,
    editPaymentByUser,
    deletePayment,
  }
}
