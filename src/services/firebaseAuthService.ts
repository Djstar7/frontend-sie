import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from 'firebase/auth'
import { auth } from '@/config/firebase'

// =============================================
// Types
// =============================================

export type OAuthProviderType = 'google' | 'facebook' | 'microsoft' | 'apple'

export interface FirebaseUserData {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  providerData: {
    providerId: string
    uid: string
    displayName: string | null
    email: string | null
    photoURL: string | null
  }[]
}

// =============================================
// Service Firebase Auth
// =============================================

export const firebaseAuthService = {
  // =============================================
  // Inscription et Connexion classique
  // =============================================

  /**
   * Inscription avec email et mot de passe
   */
  async register(email: string, password: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    // Envoyer l'email de vérification automatiquement
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user)
    }
    return userCredential
  },

  /**
   * Connexion avec email et mot de passe
   */
  async login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password)
  },

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    return signOut(auth)
  },

  // =============================================
  // Vérification d'email
  // =============================================

  /**
   * Renvoyer l'email de vérification
   */
  async resendVerificationEmail(): Promise<void> {
    const user = auth.currentUser
    if (user) {
      await sendEmailVerification(user)
    } else {
      throw new Error('Aucun utilisateur connecté')
    }
  },

  /**
   * Vérifier si l'email est vérifié
   */
  async checkEmailVerified(): Promise<boolean> {
    const user = auth.currentUser
    if (user) {
      await user.reload() // Rafraîchir les données utilisateur
      return user.emailVerified
    }
    return false
  },

  // =============================================
  // Récupération de mot de passe
  // =============================================

  /**
   * Envoyer le lien de réinitialisation par email
   */
  async sendPasswordResetLink(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email)
  },

  /**
   * Vérifier si le code de réinitialisation est valide
   */
  async verifyResetCode(code: string): Promise<string> {
    return verifyPasswordResetCode(auth, code)
  },

  /**
   * Confirmer la réinitialisation du mot de passe
   */
  async confirmPasswordReset(code: string, newPassword: string): Promise<void> {
    return confirmPasswordReset(auth, code, newPassword)
  },

  // =============================================
  // OAuth - Authentification sociale
  // =============================================

  /**
   * Connexion avec Google
   */
  async signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider()
    provider.addScope('email')
    provider.addScope('profile')
    return signInWithPopup(auth, provider)
  },

  /**
   * Connexion avec Facebook
   */
  async signInWithFacebook(): Promise<UserCredential> {
    const provider = new FacebookAuthProvider()
    provider.addScope('email')
    provider.addScope('public_profile')
    return signInWithPopup(auth, provider)
  },

  /**
   * Connexion avec Microsoft
   */
  async signInWithMicrosoft(): Promise<UserCredential> {
    const provider = new OAuthProvider('microsoft.com')
    provider.addScope('email')
    provider.addScope('profile')
    return signInWithPopup(auth, provider)
  },

  /**
   * Connexion avec Apple
   */
  async signInWithApple(): Promise<UserCredential> {
    const provider = new OAuthProvider('apple.com')
    provider.addScope('email')
    provider.addScope('name')
    return signInWithPopup(auth, provider)
  },

  /**
   * Connexion avec un provider OAuth
   */
  async signInWithOAuth(providerType: OAuthProviderType): Promise<UserCredential> {
    switch (providerType) {
      case 'google':
        return this.signInWithGoogle()
      case 'facebook':
        return this.signInWithFacebook()
      case 'microsoft':
        return this.signInWithMicrosoft()
      case 'apple':
        return this.signInWithApple()
      default:
        throw new Error(`Provider OAuth non supporté: ${providerType}`)
    }
  },

  // =============================================
  // Helpers
  // =============================================

  /**
   * Obtenir l'utilisateur actuel
   */
  getCurrentUser(): User | null {
    return auth.currentUser
  },

  /**
   * Obtenir le token JWT de l'utilisateur actuel
   */
  async getIdToken(): Promise<string | null> {
    const user = auth.currentUser
    if (user) {
      return user.getIdToken()
    }
    return null
  },

  /**
   * Observer les changements d'état d'authentification
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback)
  },

  /**
   * Convertir un User Firebase en données utilisateur
   */
  formatUserData(user: User): FirebaseUserData {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      providerData: user.providerData.map((provider) => ({
        providerId: provider.providerId,
        uid: provider.uid,
        displayName: provider.displayName,
        email: provider.email,
        photoURL: provider.photoURL,
      })),
    }
  },
}

export default firebaseAuthService
