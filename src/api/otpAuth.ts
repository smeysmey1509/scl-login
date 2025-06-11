import axios from './axios';
import instance from "./axios";

export interface ValidateOTPResponse {
    success: boolean;
    requestId: string;
    data: {
        message: string;
        refresh_token: string;
        access_token: string;
    };
}

export interface ResendOTPResponse {
    success: boolean;
    requestId: string;
    data: {
        message: string;
    };
}

export const validateOTP = async (payload: ValidateOTPResponse): Promise<ValidateOTPResponse> => {
    try {
        const response = await instance?.post("/auth/topt/validate", payload);
        return response?.data;
    } catch (error: any) {
        if (error?.response) {
            return error.response.data as ValidateOTPResponse
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

export const resentOtp = async (username: string): Promise<ResendOTPResponse> => {
    try {
        const response = await instance?.post<ResendOTPResponse>(
            `/auth/topt/resend?method=email`, {username}
        );
        return response.data;
    } catch (e: any) {
        if (e.response) {
            return e.response.data as ResendOTPResponse;
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
