import {useState} from 'react';
import {verifyUsername, verifyPassword} from '../api/accessAccount';
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

    const checkPassword = async (password: string): Promise<LoginResponse> => {
        const res = await verifyPassword({username, password});
        return res;
    };

    return {
        checkUsername,
        checkPassword,
    };
};
