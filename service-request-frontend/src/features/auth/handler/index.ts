import axios from 'axios';
import { AuthAPI } from '../api';
import type { LoginCredentials, LoginResponse } from '../types';

const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(AuthAPI.login, credentials);
    return response.data;
  } catch (e) {
    console.error('Ошибка авторизации');
    if (e instanceof Error) {
      throw e;
    }
    throw new Error('Ошибка авторизации');
  }
};

export const AuthHandler = {
  login,
};

