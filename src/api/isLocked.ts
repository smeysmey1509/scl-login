import instance from "./axios.ts";

export interface IsLockedResponse {
    success: boolean;
    requestId: string;
    data: {
        isBlocked: boolean;
    };
}

export const isLockStatus = async (): Promise<IsLockedResponse> => {
    try {
        const response = await instance?.get<IsLockedResponse>(`/auth/status`);
        return response?.data;
    } catch (error: any) {
        if (error?.response) {
            return error.response.data as IsLockedResponse
        }
        return {
            success: false,
            error: 'Network error. Please try again.',
            errorMessage: 'Unexpected error',
            requestId: '',
        };
    }
}