import {useState} from 'react';
import {verifyUsername, login} from '../api/accessAccount';
import type {VerifyUsernameResponse, LoginResponse} from '../types/accessAccount.ts';

export const useAuth = () => {
    const [username, setUsername] = useState('');

    const checkUsername = async (inputUsername: string): Promise<VerifyUsernameResponse> => {
        const res = await verifyUsername(inputUsername.trim());
        if (res.success) {
            setUsername(inputUsername.trim());
        }
        return res;
    };

    const loginUser = async (password: string): Promise<LoginResponse> => {
        const data = await login({username, password});
        localStorage.setItem('token', data.token);
        return data;
    };

    return {
        checkUsername,
        loginUser,
    };
};
