// types.ts or in User.ts
export interface VerifyUsernameResponse {
    success: boolean;
    requestId: string;
    data: {
        message: string;
        step: string;
    };
}

export interface VerifyPasswordResponse {
    success: boolean;
    requestId: string;
    data: {
        message: string;
        refresh_token: string;
        access_token: string;
    };
}
