import type { Country } from '@/types/country'
import { api } from './api.ts'

export const countryService = {
  async getCountrys(): Promise<{ data: Country[] }> {
    const response = await api.get<{ data: Country[] }>('/country')
    return response.data
  },
  async createCountry(userData: Country): Promise<{ message: string; data: Country }> {
    const response = await api.post<{ message: string; data: Country }>('/country/store', userData)
    return response.data
  },
  async editCountry(id: string, userData: Country): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/country/update/${id}`, userData)
    return response.data
  },
  async deleteCountry(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/country/delete/${id}`)
    return response.data
  },
}
