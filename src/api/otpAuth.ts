import axios from './axios';

export interface ValidateOTPRequest {
    method: string;
    otp: string;
    username: string;
}

export interface ValidateOTPResponse {
    token: string;
    success: boolean;
    message?: string;
}

export const validateOTP = async (payload: ValidateOTPRequest): Promise<ValidateOTPResponse> => {
    const response = await axios?.post("/auth/topt/validate", payload);
    return response?.data;
};