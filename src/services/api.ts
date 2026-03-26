import axios from 'axios'
import type { User } from '../types/user'

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 15000
})

export async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>('/users')
  return data
}

export async function fetchUserById(id: number): Promise<User> {
  const { data } = await api.get<User>(`/users/${id}`)
  return data
}

