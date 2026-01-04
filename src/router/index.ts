// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// Pages Auth
import LoginPage from '@/pages/LoginPage.vue'
import ForgotPasswordForm from '@/pages/ForgotPasswordForm.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import ResetPasswordPage from '@/pages/ResetPasswordPage.vue'
import VerifyEmailPage from '@/pages/VerifyEmailPage.vue'

// Pages publiques
import HomePage from '@/pages/HomePage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import ContactPage from '@/pages/ContactPage.vue'
import DeleteAccountPage from '@/pages/DeleteAccountPage.vue'

// import AdminLayout from '@/layouts/AdminLayout.vue'

// Pages Custom
import DashboardCustom from '@/pages/Custom/DashboardCustom.vue'
import AppoitmentCustom from '@/pages/Custom/AppoitmentCustom.vue'
import ChatCustom from '@/pages/Custom/ChatCustom.vue'
import DocumentsCustom from '@/pages/Custom/DocumentsCustom.vue'

import ProfilCustom from '@/pages/Custom/ProfilCustom.vue'
import VisaRequestCustom from '@/pages/Custom/VisaRequestCustom.vue'

// Composants Custom
import UploadDocument from '@/components/UploadDocument.vue'
import ReceiptVisaRequest from '@/components/ReceiptVisaRequest.vue'
import ShowVisaRequest from '@/components/ShowVisaRequest.vue'
import CreateVisaRequest from '@/components/CreateVisaRequest.vue'
import ViewListDocument from '@/components/VisaRequest/ViewListDocument.vue'

// Pages Admin
import VisaRequests from '@/pages/Admin/VisaRequestAdmin.vue'
import UsersListAdmin from '@/pages/Admin/UsersListAdmin.vue'
import DocumentsAdmin from '@/pages/Admin/DocumentsAdmin.vue'
import FAQAdmin from '@/pages/Admin/FAQAdmin.vue'
import PaymentAdmin from '@/pages/Admin/PaymentAdmin.vue'
import CountryAdmin from '@/pages/Admin/CountryAdmin.vue'
import VisaTypeAdmin from '@/pages/Admin/VisaTypeAdmin.vue'
import ProfilAdmin from '@/pages/Admin/ProfilAdmin.vue'

// Pages Agent
import VisaRequestAgent from '@/pages/Agent/VisaRequestAgent.vue'
import AppoitmentAgent from '@/pages/Agent/AppoitmentAgent.vue'
import ChatAgent from '@/pages/Agent/ChatAgent.vue'
import VisaRequest from '@/components/VisaRequest.vue'
import ViewDocument from '@/components/ViewDocument.vue'
import PaymentSuccess from '@/components/payment/PaymentSuccess.vue'
import PaymentFailed from '@/components/payment/PaymentFailed.vue'
import PaymentForm from '@/components/PaymentForm.vue'
import Dashboard from '@/pages/Admin/DashboardAdmin.vue'
import PaymentCustom from '@/pages/Custom/PaymentCustom.vue'
import ProfilAgent from '@/pages/Agent/ProfilAgent.vue'
import AddVisaAdmin from '@/pages/Admin/AddVisaAdmin.vue'
import VisaAdmin from '@/pages/Admin/visaAdmin.vue'
import ShowVisaAdmin from '@/pages/Admin/ShowVisaAdmin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/about', name: 'about', component: AboutPage },
    { path: '/contact', name: 'contact', component: ContactPage },
    { path: '/delete-account', name: 'delete-account', component: DeleteAccountPage },
    {
      path: '/auth',
      children: [
        { path: 'login', name: 'auth.login', component: LoginPage },
        { path: 'register', name: 'auth.register', component: RegisterPage },
        { path: 'forgotpassword', name: 'auth.forgotpassword', component: ForgotPasswordForm },
        { path: 'reset-password', name: 'auth.reset-password', component: ResetPasswordPage },
        { path: 'verify-email', name: 'auth.verify-email', component: VerifyEmailPage },
      ],
    },
    {
      path: '/custom',
      meta: { requiresAuth: true, roles: ['custom'] },
      children: [
        { path: 'dashboard', name: 'custom.dashboard', component: DashboardCustom },
        { path: 'appoitment', name: 'custom.appoitment', component: AppoitmentCustom },
        { path: 'delete-account', name: 'custom.delete-account', component: DeleteAccountPage },
        {
          path: 'chat/:visaRequestId?',
          name: 'custom.chat',
          component: ChatCustom,
        },

        { path: 'documents', name: 'custom.documents', component: DocumentsCustom },
        {
          path: 'payment',
          children: [
            { path: '', name: 'custom.payment', component: PaymentCustom },
            { path: 'success', name: 'custom.payment.success', component: PaymentSuccess },
            { path: 'failed', name: 'custom.payment.failed', component: PaymentFailed },
            { path: 'receipt', name: 'custom.payment.reciept', component: ReceiptVisaRequest },
            {
              path: 'store/:visaRequestId?',
              name: 'custom.payment.store',
              component: PaymentForm,
            },
          ],
        },
        { path: 'profil', name: 'custom.profil', component: ProfilCustom },
        {
          path: 'visarequest',
          children: [
            { path: '', component: VisaRequestCustom, name: 'custom.visarequest.get' },
            {
              path: 'create',
              children: [
                { path: '', component: CreateVisaRequest, name: 'custom.visarequest.create' },
                {
                  path: 'view',
                  component: ViewListDocument,
                  name: 'custom.visarequest.create.view',
                },
                {
                  path: 'upload/:visaRequestId',
                  component: UploadDocument,
                  name: 'custom.visarequest.create.upload',
                },
              ],
            },
            {
              path: 'show',
              children: [
                // { path: '', component: ShowVisaRequest, name: 'custom.visarequest.show.get' },
                {
                  path: ':visaRequestId',
                  children: [
                    {
                      path: '',
                      component: ShowVisaRequest,
                      name: 'custom.visarequest.show.get',
                    },
                    {
                      path: 'document',
                      children: [
                        {
                          path: '',
                          name: 'custom.visarequest.show.document',
                          component: ViewDocument,
                        },
                      ],
                    },
                  ],
                },
                {
                  path: 'receipt',
                  component: ReceiptVisaRequest,
                  name: 'custom.visarequest.show.receipt',
                },
              ],
            },
          ],
        },
        { path: 'upload', name: 'custom.upload', component: UploadDocument },
        { path: 'receipt', name: 'custom.receipt', component: ReceiptVisaRequest },
        { path: 'showrequest', name: 'custom.showrequest', component: ShowVisaRequest },
        { path: 'visa', name: 'custom.visa', component: VisaRequest },
      ],
    },
    {
      path: '/admin',
      meta: { requiresAuth: true, roles: ['admin'] },
      children: [
        { path: 'dashboard', name: 'admin.dashboard', component: Dashboard },
        { path: 'users', name: 'admin.users', component: UsersListAdmin },
        {
          path: 'documents',
          name: 'admin.documents',
          component: DocumentsAdmin,
        },
        { path: 'payment', name: 'admin.payment', component: PaymentAdmin },
        { path: 'country', name: 'admin.country', component: CountryAdmin },
        {
          path: 'visa',
          children: [
            { path: '', name: 'admin.visa', component: VisaAdmin },
            { path: 'add', name: 'admin.visa.add', component: AddVisaAdmin },
            { path: 'add/:id', name: 'admin.visa.edit', component: AddVisaAdmin },
            { path: 'show/:id', name: 'admin.visa.show', component: ShowVisaAdmin },
          ],
        },
        {
          path: 'visarequest',
          children: [
            { path: '', name: 'admin.visarequest', component: VisaRequests },
            {
              path: ':userId/:visaRequestId',
              name: 'admin.visarequest.show',
              component: ShowVisaRequest,
            },
          ],
        },
        { path: 'visatype', name: 'admin.visatype', component: VisaTypeAdmin },
        { path: 'faq', name: 'admin.faq', component: FAQAdmin },
        { path: 'profil', name: 'admin.profil', component: ProfilAdmin },
      ],
    },
    {
      path: '/agent',
      meta: { requiresAuth: true, roles: ['agent'] },
      children: [
        { path: 'appoitment', name: 'agent.appoitment', component: AppoitmentAgent },
        { path: 'profil', name: 'agent.profil', component: ProfilAgent },
        {
          path: 'chat',
          children: [
            { path: '', name: 'agent.chat', component: ChatAgent },
            {
              path: ':userId/:visaRequestId',
              name: 'agent.chat.user.show.visarequest.show',
              component: ChatAgent,
            },
          ],
        },
        {
          path: 'users',
          children: [
            { path: '', name: 'agent.users', component: VisaRequestAgent },
            {
              path: ':userId',
              children: [
                {
                  path: 'visarequest',
                  children: [
                    {
                      path: '',
                      name: 'agent.users.show.visarequest',
                      component: VisaRequest,
                    },
                    {
                      path: ':visaRequestId',
                      children: [
                        {
                          path: '',
                          name: 'agent.users.show.visarequest.show',
                          component: ShowVisaRequest,
                        },
                        {
                          path: 'document',
                          children: [
                            {
                              path: '',
                              name: 'agent.users.show.visarequest.show.document',
                              component: ViewDocument,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})

// Guard global
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case 'admin':
        return { name: 'admin.dashboard' }
      case 'agent':
        return { name: 'agent.users' }
      case 'custom':
        return { name: 'custom.dashboard' }
      default:
        return { name: 'auth.login' }
    }
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    if (to.name !== 'auth.login') return next({ name: 'auth.login' })
  }

  if ((to.name === 'auth.login' || to.name === 'auth.register') && userStore.isAuthenticated) {
    const dashboard = getDashboardRoute(userStore.role!)
    if (to.name !== dashboard.name) return next(dashboard)
  }

  if (to.meta.roles && userStore.isAuthenticated) {
    const roles = to.meta.roles as string[]
    if (!roles.includes(userStore.role as string)) {
      const dashboard = getDashboardRoute(userStore.role!)
      if (to.name !== dashboard.name) return next(dashboard)
    }
  }

  return next()
})

export default router
