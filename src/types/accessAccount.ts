// types.ts or in accessAccount.ts
export interface VerifyUsernameResponse {
    success: boolean;
    requestId: string;
    data: {
        message: string;
        step: string;
    };
}

export interface LoginResponse {
    token: string;
    // add other fields if any
}
