import type { PersonaResponse } from '../types/api'
import { api } from '../lib/http'

export const listPersonas = (): Promise<PersonaResponse[]> =>
  api.get('personas').json()

export const getPersona = (id: string): Promise<PersonaResponse> =>
  api.get(`personas/${id}`).json()
