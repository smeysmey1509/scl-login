import instance from './axios';
import type {VerifyUsernameResponse, VerifyPasswordResponse} from '../types/accessAccount.ts';

export const verifyUsername = async (username: string): Promise<VerifyUsernameResponse> => {
    try {
        const response = await instance.post<VerifyUsernameResponse>('/auth/verify-username', {username});
        return response.data;
    } catch (error: any) {
        if (error.response) {
            // Server responded with a status code outside 2xx
            return error.response.data as VerifyUsernameResponse;
        }

        // Fallback for network/server errors
        return {
            success: false,
            error: 'Network error. Please try again.',
            errorMessage: 'Unexpected error',
            requestId: '',
        };
    }
};

export const verifyPassword = async (data: { username: string; password: string }): Promise<VerifyPasswordResponse> => {
    try {
        const response = await instance.post<VerifyPasswordResponse>('/auth/verify-password', data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data as VerifyPasswordResponse;
        }

        // Fallback for network/server errors
        return {
            success: false,
            error: 'Network error. Please try again.',
            errorMessage: 'Unexpected error',
            requestId: '',
        };
    }
};
