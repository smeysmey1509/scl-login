import {useState} from 'react';
import {verifyUsername, verifyPassword} from '../api/User.ts';
import type {VerifyUsernameResponse, VerifyPasswordResponse} from '../types/accessAccount.ts';

export const useAuth = () => {
    const [username, setUsername] = useState('');

    const checkUsername = async (inputUsername: string): Promise<VerifyUsernameResponse> => {
        const res = await verifyUsername(inputUsername);
        if (res.success) {
            setUsername(inputUsername);
        }
        return res;
    };

    const checkPassword = async (password: string): Promise<VerifyPasswordResponse> => {
        const data = await verifyPassword({username, password});
        return data;
    };

    return {
        checkUsername,
        checkPassword,
    };
};
