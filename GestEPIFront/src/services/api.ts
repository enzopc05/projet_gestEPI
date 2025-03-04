import axios from 'axios';
import { EPI, EPIType, EPIStatus, User, EPICheck } from '../types';

const API_URL = 'http://localhost:5500/api';

// EPI
export const getAllEPIs = async () => {
  const response = await axios.get<EPI[]>(`${API_URL}/epis`);
  return response.data;
};

export const getEPIById = async (id: number) => {
  const response = await axios.get<EPI>(`${API_URL}/epis/${id}`);
  return response.data;
};

export const createEPI = async (epi: EPI) => {
  const response = await axios.post<EPI>(`${API_URL}/epis`, epi);
  return response.data;
};

export const updateEPI = async (id: number, epi: EPI) => {
  const response = await axios.put<EPI>(`${API_URL}/epis/${id}`, epi);
  return response.data;
};

export const deleteEPI = async (id: number) => {
  await axios.delete(`${API_URL}/epis/${id}`);
};

// EPI Types
export const getAllEPITypes = async () => {
  const response = await axios.get<EPIType[]>(`${API_URL}/epi-types`);
  return response.data;
};

// EPI Status
export const getAllEPIStatus = async () => {
  const response = await axios.get<EPIStatus[]>(`${API_URL}/epi-status`);
  return response.data;
};

// Users
export const getAllUsers = async () => {
  const response = await axios.get<User[]>(`${API_URL}/users`);
  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await axios.get<User>(`${API_URL}/users/${id}`);
  return response.data;
};

export const createUser = async (user: User) => {
  const response = await axios.post<User>(`${API_URL}/users`, user);
  return response.data;
};

export const updateUser = async (id: number, user: User) => {
  const response = await axios.put<User>(`${API_URL}/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number) => {
  await axios.delete(`${API_URL}/users/${id}`);
};