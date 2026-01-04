import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyBzDsHRofbFIWm85v-6FBBFO6GHfCCcLQw',
  authDomain: 'serviceimmigrationestauaire.firebaseapp.com',
  projectId: 'serviceimmigrationestauaire',
  storageBucket: 'serviceimmigrationestauaire.firebasestorage.app',
  messagingSenderId: '279045230656',
  appId: '1:279045230656:web:968eb7d8c31041a7918fa5',
  measurementId: 'G-W63SJ7MX9V',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const analytics = getAnalytics(app)

export { app, auth, analytics }
