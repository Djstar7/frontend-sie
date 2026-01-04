import { api } from './api'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

interface ContactResponse {
  message: string
}

export const contactService = {
  async send(data: ContactForm): Promise<ContactResponse> {
    const response = await api.post<ContactResponse>('/contact', data)
    return response.data
  },
}
