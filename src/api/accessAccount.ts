import axios from './axios';
import type {VerifyUsernameResponse, LoginResponse} from '../types/accessAccount.ts';

export const verifyUsername = async (username: string): Promise<VerifyUsernameResponse> => {
    const response = await axios.post<VerifyUsernameResponse>('/auth/verify-username', {username});
    return response.data;
};

export const login = async (data: { username: string; password: string }): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>('/auth/login', data);
    return response.data;
};
