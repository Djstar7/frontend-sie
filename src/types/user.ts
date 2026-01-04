type Role = 'admin' | 'custom' | 'agent'
type Gender = 'male' | 'female'
type StatusMat = 'single' | 'married' | 'divorced' | 'widowed'

interface UserRegister {
  id?: string
  name: string
  email: string
  password?: string
  image?: string
  role?: Role
  firebase_uid?: string
}

interface UserLogin {
  email: string
  password: string
  firebase_token?: string
}

interface FirebaseLoginData {
  firebase_token: string
  firebase_uid: string
  email: string | null
  name: string | null
  photo_url: string | null
  provider: string
}
interface UserForgotPassword {
  email: string
}

interface Profil {
  id?: string
  user_id: string
  first_name: string
  last_name: string
  phone: string
  gender: Gender
  date_of_birth: string
  place_of_birth: string
  status_mat: StatusMat
  nationality: string
}

interface Profil {
  id?: string
  user_id: string
  first_name: string
  last_name: string
  phone: string
  gender: Gender
  date_of_birth: string
  place_of_birth: string
  status_mat: StatusMat
  nationality: string
}
interface Custom {
  id?: string
  name: string
  email: string
  phone: string
  password?: string
  password_confirmation?: string
  role?: Role
  first_name: string
  last_name: string
  gender: Gender
  date_of_birth: string
  place_of_birth: string
  status_mat: StatusMat
  nationality: string
  // visa_type_name?: string
}

interface UserState {
  user: UserRegister | null
  profil: Profil | null
  custom: Custom | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
interface LoginData {
  email: string
  password: string
}

interface AuthResponse {
  message: string
  user: UserRegister
  profil?: Profil
  access_token: string
}
interface UserResponse {
  message: string
  user: Custom | UserRegister
  custom?: Custom
}
export type UserData = UserRegister & {
  numberMessageUnRead: number
  numberVisaRequestPending: number
}

export type {
  UserRegister,
  UserLogin,
  FirebaseLoginData,
  Profil,
  UserState,
  UserForgotPassword,
  Role,
  Custom,
  StatusMat,
  LoginData,
  AuthResponse,
  UserResponse,
  Gender,
}
